/** @type {import('next').NextConfig} */
// Use empty string for local dev (NEXT_PUBLIC_BASE_PATH=""), otherwise default to production path
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : "/us/keep-your-pay-act";

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  output: "standalone",
};

module.exports = nextConfig;
