/**
 * Contact form submissions — server only.
 *
 * Saved to data/contact-messages.json (override with CONTACT_MESSAGES_FILE),
 * newest first, so no message is ever lost. Connect an email or CRM service
 * here when one is chosen; the form and validation stay the same.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface ContactMessage {
  id: string;
  topic: string;
  fields: Record<string, string>;
  createdAt: string;
}

const FILE = path.resolve(process.env.CONTACT_MESSAGES_FILE ?? "data/contact-messages.json");

async function readAll(): Promise<ContactMessage[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as ContactMessage[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/** Writes are serialised and go through a temp file, so a crash never leaves half a file. */
let queue: Promise<unknown> = Promise.resolve();

export function saveContactMessage(topic: string, fields: Record<string, string>) {
  const run = queue.then(async () => {
    const messages = await readAll();
    const message: ContactMessage = { id: randomUUID(), topic, fields, createdAt: new Date().toISOString() };
    messages.unshift(message);
    await mkdir(path.dirname(FILE), { recursive: true });
    const temp = `${FILE}.${process.pid}.tmp`;
    await writeFile(temp, JSON.stringify(messages, null, 2));
    await rename(temp, FILE);
    return message;
  });
  queue = run.catch(() => undefined);
  return run;
}
