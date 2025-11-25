import type { NextConfig } from "next";

// Extract WordPress hostname from environment variable
const getWordPressHostname = () => {
  const wordpressUrl = process.env.WORDPRESS_API_URL || process.env.HOMEPAGE_API_URL || '';
  try {
    const url = new URL(wordpressUrl);
    return url.hostname;
  } catch {
    return '';
  }
};

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getWordPressHostname(),
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
