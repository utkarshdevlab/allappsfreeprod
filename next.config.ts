import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL || 'https://www.allappsfree.com';

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  basePath: isProduction ? '' : '',
  assetPrefix: isProduction ? '' : '',
  
  // Handle redirects
  async redirects() {
    if (!isProduction) return [];
    
    return [
      // Remove trailing slashes
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'allappsfree.com',
          },
        ],
        destination: 'https://www.allappsfree.com/:path*',
        permanent: true,
      },
    ];
  },
  
  // Add canonical URL headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: `<${canonicalBase}/:path*>; rel="canonical"`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
