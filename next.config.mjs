/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static site: `next build` writes plain HTML/CSS/JS to /out for any static host.
  output: "export",
  // Static export has no image server, so images are served as-is (compress them before adding).
  images: { unoptimized: true },
  // Emits /about/index.html so /about works on Apache hosts like Hostinger.
  trailingSlash: true,
  // Next 16 turns Cache Components on by default, but it cannot run with output: "export"
  cacheComponents: false,
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
