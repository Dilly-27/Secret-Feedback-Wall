/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding'],
};

module.exports = nextConfig;
