import './src/lib/loadEnv.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.shopify.com',
          pathname: '/s/files/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  
