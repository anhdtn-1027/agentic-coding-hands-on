// Re-export Auth.js v5 primitives for use across the app.
// Server components use auth() to read the session.
// Server actions / route handlers use signIn() and signOut().
export { auth, signIn, signOut } from "@/auth";
