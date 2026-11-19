import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { ReactNode } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { Layout } from "./routes/layout";
import { Button } from "./components/ui/Button";
import { SITE } from "./lib/site";
import { getUser } from "./lib/auth.server";

/** Who is signed in, for every page. Read it with useUser() from ~/lib/auth. */
export async function loader({ request }: Route.LoaderArgs) {
  return { user: await getUser(request) };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: `${SITE.name} — ${SITE.primaryMessage}` },
  { name: "description", content: SITE.description },
];

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <Meta />
        <Links />
        {/* Scroll-reveal animations start hidden; without JS they must not
            swallow the page. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Layout>
        <Outlet />
      </Layout>
    </AppLayout>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page not found" : "Error";
    details =
      error.status === 404
        ? "That page does not exist — but your next opportunity still might."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <AppLayout>
      <Layout>
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {isRouteErrorResponse(error) ? error.status : "Error"}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em] text-ink-900 sm:text-5xl">
              {message}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {details}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/" size="lg">
                Back to home
              </Button>
              <Button to="/opportunities" variant="secondary" size="lg">
                Find opportunities
              </Button>
            </div>

            {stack && (
              <pre className="mt-10 w-full overflow-x-auto rounded-2xl bg-ink-900 p-5 text-xs leading-relaxed text-ink-200">
                <code>{stack}</code>
              </pre>
            )}
          </div>
        </section>
      </Layout>
    </AppLayout>
  );
}
