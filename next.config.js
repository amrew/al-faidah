/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
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
