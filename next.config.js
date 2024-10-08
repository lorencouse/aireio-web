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
    domains: [
      'maps.googleapis.com',
      'aireio.com',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')
    ].filter(Boolean)
  },

  webpack(config) {
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
  }

  // Add any additional configurations here
};

// Wrap the config with withBundleAnalyzer
module.exports = withBundleAnalyzer(nextConfig);
