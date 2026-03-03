/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: __dirname, // Ensure the correct root directory is set
    },
  },
};

module.exports = nextConfig;