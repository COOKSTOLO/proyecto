import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'hooks', 'context', 'pages', 'utils', 'types']
  },
};

export default nextConfig;
