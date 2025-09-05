import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client"],
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
