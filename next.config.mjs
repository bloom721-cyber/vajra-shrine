/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // static export — required for Capacitor iOS/Android
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
