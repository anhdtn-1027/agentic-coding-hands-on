import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { KudosBoardProvider } from "@/components/sun-kudos/kudos-board-provider";
import { WriteKudosModalHost } from "@/components/sun-kudos/write-kudos-modal-host";
import "@/app/globals.css";

// Primary brand font — Montserrat (Latin + Vietnamese subsets)
const montserrat = Montserrat({
  variable: "--font-saa-brand",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

// Alternate brand font — Montserrat Alternates (copyright text in footer)
const montserratAlt = Montserrat_Alternates({
  variable: "--font-saa-alt",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sun* Annual Awards 2025",
  description: "SAA 2025 — Vinh danh những cá nhân xuất sắc",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale — 404 for unrecognised segments
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering for this locale (next-intl v4 API)
  setRequestLocale(locale);

  // Load translated messages for NextIntlClientProvider
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${montserratAlt.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#00101A", color: "#FFFFFF" }}
      >
        <NextIntlClientProvider messages={messages}>
          <KudosBoardProvider>
            {children}
            <WriteKudosModalHost />
          </KudosBoardProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
