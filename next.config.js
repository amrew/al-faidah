/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "apiapk.radioislam.or.id",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
