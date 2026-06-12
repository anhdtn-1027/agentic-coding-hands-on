import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Provider list. The Google provider is always present; a DEV-ONLY credentials
// provider ("dev-login") is added when not in production so the app can be
// exercised locally without real Google OAuth credentials. It NEVER ships to
// production (guarded by NODE_ENV) and performs no password check by design —
// it is a local testing affordance only.
const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
];

if (process.env.NODE_ENV !== "production") {
  providers.push(
    Credentials({
      id: "dev-login",
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      authorize(creds) {
        const email = typeof creds?.email === "string" ? creds.email.trim() : "";
        if (!email) return null;
        const name =
          typeof creds?.name === "string" && creds.name.trim()
            ? creds.name.trim()
            : email.split("@")[0];
        return { id: email, email, name };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    jwt({ token, user }) {
      // Persist role on first sign-in (user is only defined on the initial JWT creation)
      if (user?.email) {
        token.role = getAdminEmails().includes(user.email.toLowerCase()) ? "admin" : "user";
      }
      return token;
    },

    session({ session, token }) {
      // Expose role to the client-safe session object
      if (session.user) {
        session.user.role = (token.role ?? "user") as "admin" | "user";
      }
      return session;
    },
  },
});
