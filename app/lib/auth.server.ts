/**
 * Accounts, invites and sessions — server only.
 *
 * Sign-up is invite-only. Admins are named in advance by the ADMIN_EMAILS
 * environment variable (comma-separated, e.g. in .env). An admin can always
 * create their own account; everyone else needs an invite that an admin
 * added on /admin/invites.
 *
 * Users and invites live in JSON files under data/ (override with USERS_FILE
 * and INVITES_FILE). That is enough for development and a single small
 * server; swap the storage helpers for a real database before production.
 *
 * Passwords are hashed with scrypt and a per-user random salt, and compared
 * in constant time. The session is a signed, httpOnly cookie holding only the
 * user id.
 */
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCookieSessionStorage } from "react-router";

import type { Invite, PublicUser, Role } from "./auth";

// Pick up ADMIN_EMAILS / SESSION_SECRET from a local .env, if there is one.
// Variables already set in the environment win.
try {
  process.loadEnvFile();
} catch {
  /* no .env file — fine */
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  salt: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_FILE = path.resolve(process.env.USERS_FILE ?? "data/users.json");
const INVITES_FILE = path.resolve(process.env.INVITES_FILE ?? "data/invites.json");
const KEY_LENGTH = 64;

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

/* ---- Admins ------------------------------------------------------------- */

function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map(normaliseEmail)
      .filter(Boolean),
  );
}

export const isAdminEmail = (email: string) => adminEmails().has(normaliseEmail(email));

/* ---- Password hashing -------------------------------------------------- */

function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password.normalize("NFKC"), salt, KEY_LENGTH, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt);
  return { salt, passwordHash: hash.toString("hex") };
}

async function verifyPassword(password: string, user: StoredUser) {
  const expected = Buffer.from(user.passwordHash, "hex");
  const actual = await scrypt(password, user.salt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/* ---- Storage ------------------------------------------------------------ */

async function readJson<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/**
 * All writes go through one queue (so two sign-ups can never interleave) and
 * through a temp file (so a crash never leaves half a file).
 */
let writeQueue: Promise<unknown> = Promise.resolve();

function serialise<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function writeJson<T>(file: string, rows: T[]) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(rows, null, 2));
  await rename(temp, file);
}

const toPublic = ({ id, name, email, role }: StoredUser): PublicUser => ({
  id,
  name,
  email,
  role,
  isAdmin: isAdminEmail(email),
});

/* ---- Invites ------------------------------------------------------------ */

export const listInvites = () => readJson<Invite>(INVITES_FILE);

export class AlreadyInvitedError extends Error {}
export class AlreadyMemberError extends Error {}

export function addInvite(email: string, invitedBy: string): Promise<Invite> {
  const address = normaliseEmail(email);
  return serialise(async () => {
    const [invites, users] = await Promise.all([
      readJson<Invite>(INVITES_FILE),
      readJson<StoredUser>(USERS_FILE),
    ]);
    if (users.some((user) => user.email === address)) throw new AlreadyMemberError();
    if (invites.some((invite) => invite.email === address)) throw new AlreadyInvitedError();
    const invite: Invite = {
      email: address,
      invitedBy: normaliseEmail(invitedBy),
      createdAt: new Date().toISOString(),
      acceptedAt: null,
    };
    invites.unshift(invite);
    await writeJson(INVITES_FILE, invites);
    return invite;
  });
}

/** Only pending invites can be revoked; an accepted one is an account now. */
export function revokeInvite(email: string): Promise<void> {
  const address = normaliseEmail(email);
  return serialise(async () => {
    const invites = await readJson<Invite>(INVITES_FILE);
    await writeJson(
      INVITES_FILE,
      invites.filter((invite) => invite.email !== address || invite.acceptedAt),
    );
  });
}

/* ---- Users -------------------------------------------------------------- */

export class EmailTakenError extends Error {}
export class NotInvitedError extends Error {}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<PublicUser> {
  const email = normaliseEmail(input.email);
  const secret = await hashPassword(input.password);

  return serialise(async () => {
    const [users, invites] = await Promise.all([
      readJson<StoredUser>(USERS_FILE),
      readJson<Invite>(INVITES_FILE),
    ]);
    if (users.some((user) => user.email === email)) throw new EmailTakenError();

    const invite = invites.find((candidate) => candidate.email === email && !candidate.acceptedAt);
    if (!invite && !isAdminEmail(email)) throw new NotInvitedError();

    const user: StoredUser = {
      id: randomUUID(),
      name: input.name.trim(),
      email,
      role: input.role,
      ...secret,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeJson(USERS_FILE, users);

    if (invite) {
      invite.acceptedAt = user.createdAt;
      await writeJson(INVITES_FILE, invites);
    }
    return toPublic(user);
  });
}

export async function authenticate(email: string, password: string): Promise<PublicUser | null> {
  const users = await readJson<StoredUser>(USERS_FILE);
  const user = users.find((candidate) => candidate.email === normaliseEmail(email));
  if (!user) {
    // Spend the same time as a real check, so response timing does not
    // reveal which emails have accounts.
    await scrypt(password, "0".repeat(32));
    return null;
  }
  return (await verifyPassword(password, user)) ? toPublic(user) : null;
}

/* ---- Sessions ----------------------------------------------------------- */

const isProduction = process.env.NODE_ENV === "production";
const secret = process.env.SESSION_SECRET;
if (!secret && isProduction) {
  throw new Error("SESSION_SECRET must be set in production.");
}

const sessionStorage = createCookieSessionStorage<{ userId: string }>({
  cookie: {
    name: "__humnova_session",
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secrets: [secret ?? "humnova-dev-only-secret"],
  },
});

export async function getUser(request: Request): Promise<PublicUser | null> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) return null;
  const user = (await readJson<StoredUser>(USERS_FILE)).find((candidate) => candidate.id === userId);
  return user ? toPublic(user) : null;
}

/** For admin-only loaders and actions: the admin, or a 404 for anyone else. */
export async function requireAdmin(request: Request): Promise<PublicUser> {
  const user = await getUser(request);
  if (!user?.isAdmin) throw new Response("Not Found", { status: 404 });
  return user;
}

export async function startSession(request: Request, userId: string): Promise<string> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  session.set("userId", userId);
  return sessionStorage.commitSession(session);
}

export async function endSession(request: Request): Promise<string> {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return sessionStorage.destroySession(session);
}
