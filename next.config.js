/** @type {import('next').NextConfig} */
const nextConfig = {
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
