/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/us/keep-your-pay-act";

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  output: "standalone",
};

module.exports = nextConfig;
