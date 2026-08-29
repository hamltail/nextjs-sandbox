import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2031dc3a3200414db7adae8d4cdb6da5.r2.dev",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
