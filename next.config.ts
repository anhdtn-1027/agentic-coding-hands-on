import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// Points to i18n/request.ts — explicit path for clarity (§3a from infra report)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
