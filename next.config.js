const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src']
  },

  reactStrictMode: true,
  swcMinify: true,

  images: {
    unoptimized: true, // This disables Next.js Image Optimization
    domains: [
      'maps.googleapis.com',
      'aireio.com',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')
    ].filter(Boolean)
  },

  webpack(config, { isServer }) {
    // SVG handling configuration
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true
        }
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    // Add any other Webpack optimizations here
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      };
    }

    return config;
  },

  // Add this for Cloudflare Pages compatibility
  experimental: {
    outputFileTracingRoot: undefined
  }
};

// Wrap the config with withBundleAnalyzer
module.exports = withBundleAnalyzer(nextConfig);
