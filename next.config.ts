import type { NextConfig } from "next";

/** 与 GitHub 仓库名一致 → https://brianbai1123.github.io/cgt/ */
const repo = "cgt";
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "cursor.sh",
    "*.cursor.sh",
    "cursor.com",
    "*.cursor.com",
    "cursorusercontent.com",
    "*.cursorusercontent.com",
    "null",
  ],
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isGhPages ? `/${repo}` : "",
  assetPrefix: isGhPages ? `/${repo}/` : undefined,
};

export default nextConfig;
