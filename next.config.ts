import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  env: {
    // Año de compilación para el pie de página (evita `new Date()` en el prerender).
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  partialPrefetching: true,
  images: {
    // AVIF primero, WebP como respaldo. Next.js Image negocia el formato con el navegador.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
    qualities: [75, 90],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
