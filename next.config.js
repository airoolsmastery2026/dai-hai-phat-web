/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.unsplash.com" }],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
