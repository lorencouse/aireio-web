import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ['src']
  },

  images: {
    unoptimized: true, // This disables Next.js Image Optimization
    domains: [
    'maps.googleapis.com',
    'aireio.com',
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? [process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '')] 
        : [])
    ]
  }
};

export default nextConfig;
