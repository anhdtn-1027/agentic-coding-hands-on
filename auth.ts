import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

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
