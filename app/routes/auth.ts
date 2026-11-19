/**
 * Resource route for the sign-in / sign-up dialog. POST only; the dialog
 * submits here with a fetcher, so the visitor never leaves the page.
 */
import { data, redirect } from "react-router";

import type { Route } from "./+types/auth";
import type { AuthFieldErrors, AuthResult, Role } from "~/lib/auth";
import {
  EmailTakenError,
  NotInvitedError,
  authenticate,
  createUser,
  endSession,
  startSession,
} from "~/lib/auth.server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function loader() {
  // Nothing to show at /auth itself.
  return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");

  if (intent === "signout") {
    return data<AuthResult>(
      { ok: true, mode: "signout" },
      { headers: { "Set-Cookie": await endSession(request) } },
    );
  }

  if (intent !== "signin" && intent !== "signup") {
    return data<AuthResult>({ ok: false, mode: "signin", error: "Unknown request." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const role = String(form.get("role") ?? "talent") as Role;

  const fieldErrors: AuthFieldErrors = {};
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (intent === "signup") {
    if (name.length < 2) fieldErrors.name = "Tell us your name.";
    if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
    if (role !== "talent" && role !== "employer") fieldErrors.role = "Choose one.";
  } else if (!password) {
    fieldErrors.password = "Enter your password.";
  }
  if (Object.keys(fieldErrors).length) {
    return data<AuthResult>({ ok: false, mode: intent, fieldErrors }, { status: 400 });
  }

  if (intent === "signup") {
    try {
      const user = await createUser({ name, email, password, role });
      return data<AuthResult>(
        { ok: true, mode: intent },
        { headers: { "Set-Cookie": await startSession(request, user.id) } },
      );
    } catch (error) {
      if (error instanceof EmailTakenError) {
        return data<AuthResult>(
          {
            ok: false,
            mode: intent,
            fieldErrors: { email: "An account with this email already exists. Sign in instead." },
          },
          { status: 409 },
        );
      }
      if (error instanceof NotInvitedError) {
        return data<AuthResult>(
          {
            ok: false,
            mode: intent,
            fieldErrors: {
              email: "This email hasn't been invited yet. Ask a HUMNOVA admin to invite you, then sign up with the same email.",
            },
          },
          { status: 403 },
        );
      }
      throw error;
    }
  }

  const user = await authenticate(email, password);
  if (!user) {
    return data<AuthResult>(
      { ok: false, mode: intent, error: "That email and password don't match an account." },
      { status: 401 },
    );
  }
  return data<AuthResult>(
    { ok: true, mode: intent },
    { headers: { "Set-Cookie": await startSession(request, user.id) } },
  );
}
