// Root layout — minimal shell required by Next.js App Router.
// Actual per-locale layout (fonts, providers, html/body) lives in app/[locale]/layout.tsx.
// This file exists only to satisfy the Next.js requirement for a root layout.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
