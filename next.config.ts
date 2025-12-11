import type { NextConfig } from "next";

const getWordPressBaseUrl = () => {
  const wordpressUrl = process.env.WORDPRESS_API_URL || '';
  try {
    const url = new URL(wordpressUrl);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return '';
  }
};

const getWordPressHostname = () => {
  const wordpressUrl = process.env.WORDPRESS_API_URL || '';
  try {
    return new URL(wordpressUrl).hostname;
  } catch {
    return '';
  }
};

const getSiteHostname = () => {
  const siteUrl = process.env.SITE_BASE_URL || '';
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return '';
  }
};

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    const wpBaseUrl = getWordPressBaseUrl();
    if (!wpBaseUrl) return [];
    
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: `${wpBaseUrl}/wp-content/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getWordPressHostname(),
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: getSiteHostname(),
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;