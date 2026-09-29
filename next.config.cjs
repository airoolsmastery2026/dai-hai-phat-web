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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "microphone=(self), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/services/ket-cau-thep-cua-cong",
        destination: "/services/cua-cong-co-khi-dan-dung",
        permanent: true,
      },
      {
        source: "/services/noi-that-gỗ-mdf-melamine",
        destination: "/services/noi-that-go-mdf-melamine",
        permanent: true,
      },
      {
        source: "/blog/giai-phap-thiet-ke-tu-quan-ao-gỗ-mdf-melamine",
        destination: "/blog/giai-phap-thiet-ke-tu-quan-ao-go-mdf-melamine",
        permanent: true,
      },
      {
        source: "/blog/mau-giuong-ngu-khung-thep-gỗ-mdf-melamine",
        destination: "/blog/mau-giuong-ngu-khung-thep-go-mdf-melamine",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/services/noi-that-go-mdf-melamine",
        destination: "/services/noi-that-gỗ-mdf-melamine",
      },
    ];
  },
};

module.exports = nextConfig;
