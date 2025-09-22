/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
