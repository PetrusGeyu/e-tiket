/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi utama
  reactStrictMode: true,

  // Jika kamu masih pakai rewrites ke backend lokal / deploy:
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://lapakjarubackend.xyz/api/:path*", // ganti sesuai backend kamu
      },
    ];
  },

  // Tambahkan ini agar Next.js 16 paham kita pakai Turbopack
  turbopack: {},
};

export default nextConfig;
