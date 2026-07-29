/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: "/services/ket-cau-thep-cua-cong",
        destination: "/services/cua-cong-co-khi-dan-dung",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
