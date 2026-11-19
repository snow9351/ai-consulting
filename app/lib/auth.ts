/**
 * Client-safe auth types and helpers. The server half (hashing, storage,
 * sessions) lives in auth.server.ts and is never bundled for the browser.
 */
import { useRouteLoaderData } from "react-router";

export type Role = "talent" | "employer";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Named in ADMIN_EMAILS on the server; can invite people. */
  isAdmin: boolean;
}

export interface Invite {
  email: string;
  /** Email of the admin who sent it. */
  invitedBy: string;
  createdAt: string;
  /** When the invited person created their account; null while pending. */
  acceptedAt: string | null;
}

export type AuthMode = "signin" | "signup";

export type AuthFieldErrors = Partial<Record<"name" | "email" | "password" | "role", string>>;

export interface AuthResult {
  ok: boolean;
  mode: AuthMode | "signout";
  error?: string;
  fieldErrors?: AuthFieldErrors;
}

/** The signed-in user, from the root loader; null when signed out. */
export function useUser(): PublicUser | null {
  // Undefined inside the root error boundary, where the loader may not have run.
  const data = useRouteLoaderData("root") as { user: PublicUser | null } | undefined;
  return data?.user ?? null;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}
