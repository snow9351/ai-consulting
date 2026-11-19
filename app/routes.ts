import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // HUMNOVA platform. Functionality lands in Phases 2–5; these routes exist so
  // the navigation resolves and visitors get an honest status instead of a 404
  // or a mocked-up page.
  route("opportunities", "routes/platform/opportunities.tsx"),
  route("employers", "routes/platform/employers.tsx"),
  route("join", "routes/platform/join.tsx"),

  route("contact", "routes/contact.tsx"),

  // Sign in / sign up / sign out. POST-only resource route used by the
  // auth dialog; the visitor never navigates to it.
  route("auth", "routes/auth.ts"),

  // Admin only (404 for everyone else): invite people to sign up.
  route("admin/invites", "routes/admin/invites.tsx"),

  route("guidelines", "routes/legal/guidelines.tsx"),
  route("privacy", "routes/legal/privacy.tsx"),
  route("terms", "routes/legal/terms.tsx"),
] satisfies RouteConfig;
