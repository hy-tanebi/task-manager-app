/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xxx.supabase.co",
      },
    ],
  },
  output: 'standalone'  // ← 追加
}

export default nextConfig
