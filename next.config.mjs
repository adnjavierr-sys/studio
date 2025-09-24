/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN || 'your-store-name.myshopify.com',
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  },
};

export default nextConfig;
