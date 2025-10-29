//Cata
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.imgur.com" },
    ],
  },

  // 🧩 Ignorar errores de ESLint al compilar (para evitar fallos en Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
