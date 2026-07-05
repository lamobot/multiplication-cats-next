import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',   // static HTML export — no Node.js server needed
  distDir: 'dist',    // match the S3 workflow convention
  trailingSlash: true, // index.html inside each folder (works with S3 static hosting)
};

export default nextConfig;
