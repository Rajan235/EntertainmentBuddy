import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org", // 👈 Fixes your current error
      },
      {
        protocol: "https",
        hostname: "images.igdb.com", // For Games
      },
      {
        protocol: "https",
        hostname: "books.google.com", // For Books
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // For Spotify (if you add music later)
      },
    ],
  },
};

export default nextConfig;
