const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const CompressionPlugin = require('compression-webpack-plugin');

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

  webpack(config) {
    // Enable Gzip compression for Webpack bundles
    config.plugins.push(
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    );

    // SVG handling configuration (unchanged)
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

    return config;
  },

  // Add this for Cloudflare Pages compatibility
  experimental: {
    outputFileTracingRoot: undefined
  }
};

// Wrap the config with withBundleAnalyzer
module.exports = withBundleAnalyzer(nextConfig);
