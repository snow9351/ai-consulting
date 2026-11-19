import { useEffect, useRef } from "react";
import { data, useFetcher } from "react-router";

import type { Route } from "./+types/invites";
import { Container } from "~/components/ui/Container";
import { Check, UserPlus } from "~/components/ui/icons";
import {
  AlreadyInvitedError,
  AlreadyMemberError,
  addInvite,
  listInvites,
  requireAdmin,
  revokeInvite,
} from "~/lib/auth.server";
import { SITE } from "~/lib/site";

export function meta() {
  return [{ title: `Invites | ${SITE.name}` }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const admin = await requireAdmin(request);
  return { admin, invites: await listInvites() };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function action({ request }: Route.ActionArgs) {
  const admin = await requireAdmin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  const email = String(form.get("email") ?? "").trim();

  if (intent === "revoke") {
    await revokeInvite(email);
    return data<ActionResult>({ ok: true, message: `Invite for ${email} revoked.` });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return data<ActionResult>({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  try {
    const invite = await addInvite(email, admin.email);
    return data<ActionResult>({
      ok: true,
      message: `${invite.email} is invited. Ask them to sign up on ${SITE.name} with this email.`,
    });
  } catch (error) {
    if (error instanceof AlreadyInvitedError) {
      return data<ActionResult>({ ok: false, error: "That email is already invited." }, { status: 409 });
    }
    if (error instanceof AlreadyMemberError) {
      return data<ActionResult>({ ok: false, error: "That email already has an account." }, { status: 409 });
    }
    throw error;
  }
}

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

function RevokeButton({ email }: { email: string }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="revoke" />
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={fetcher.state !== "idle"}
        className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {fetcher.state !== "idle" ? "Revoking…" : "Revoke"}
      </button>
    </fetcher.Form>
  );
}

export default function InvitesRoute({ loaderData }: Route.ComponentProps) {
  const { admin, invites } = loaderData;
  const fetcher = useFetcher<ActionResult>();
  const formRef = useRef<HTMLFormElement>(null);
  const busy = fetcher.state !== "idle";
  const result = fetcher.data;

  // Clear the field after a successful invite.
  useEffect(() => {
    if (fetcher.state === "idle" && result?.ok) formRef.current?.reset();
  }, [fetcher.state, result]);

  const pending = invites.filter((invite) => !invite.acceptedAt).length;

  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-[#f2f6ff] to-white py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full bg-brand-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Admin
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.03em] text-ink-950">Invite people</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-600">
            Sign-up is invite-only. Add someone&rsquo;s email here, and they can create an account
            with exactly that address. You&rsquo;re signed in as{" "}
            <strong className="font-semibold text-ink-900">{admin.email}</strong>.
          </p>

          <fetcher.Form
            ref={formRef}
            method="post"
            noValidate
            className="mt-8 flex flex-col gap-3 rounded-[1.5rem] bg-white p-4 shadow-[0_20px_50px_-30px_rgb(42_88_208/0.45)] ring-1 ring-ink-100 sm:flex-row sm:items-center"
          >
            <input type="hidden" name="intent" value="invite" />
            <label className="flex-1">
              <span className="sr-only">Email to invite</span>
              <input
                name="email"
                type="email"
                required
                placeholder="name@gmail.com"
                className="h-12 w-full rounded-xl border border-ink-200 px-4 text-[0.9375rem] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-6 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(53_106_230/0.7)] transition-colors hover:bg-brand-600 disabled:opacity-70"
            >
              <UserPlus className="h-5 w-5" />
              {busy ? "Inviting…" : "Send invite"}
            </button>
          </fetcher.Form>

          {result && (
            <p
              role="status"
              className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                result.ok ? "bg-signal-50 text-signal-600" : "bg-red-50 text-red-700"
              }`}
            >
              {result.ok ? result.message : result.error}
            </p>
          )}

          <div className="mt-12 flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink-950">Invites</h2>
            <p className="text-sm text-ink-500">
              {invites.length} total · {pending} pending
            </p>
          </div>

          {invites.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-ink-200 p-8 text-center text-ink-500">
              No invites yet. Add an email above.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
              {invites.map((invite) => (
                <li key={invite.email} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink-900">{invite.email}</p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      Invited {dateFormat.format(new Date(invite.createdAt))} by {invite.invitedBy}
                    </p>
                  </div>
                  {invite.acceptedAt ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-50 px-3 py-1 text-sm font-semibold text-signal-600">
                      <Check className="h-4 w-4" />
                      Joined {dateFormat.format(new Date(invite.acceptedAt))}
                    </span>
                  ) : (
                    <>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        Pending
                      </span>
                      <RevokeButton email={invite.email} />
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
