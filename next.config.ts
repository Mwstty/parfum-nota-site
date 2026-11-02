import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimize edilecek yerel görseller yalnızca public/images altından gelir.
    localPatterns: [{ pathname: "/images/**", search: "" }],
    // Yasal bir görsel sağlayıcı seçildiğinde yalnızca onun alan adı buraya eklenir.
    remotePatterns: [],
  },
};

export default nextConfig;
