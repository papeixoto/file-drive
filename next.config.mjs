/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "doting-salmon-394.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
