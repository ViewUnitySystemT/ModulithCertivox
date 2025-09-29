/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/tel' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tel' : '',
  experimental: {
    // appDir is now stable in Next.js 14
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    CUSTOM_KEY: 'rf-ui-portal',
  },
  webpack: (config, { dev, isServer }) => {
    // Custom webpack configuration for RF applications
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-defines-loader',
        'glslify-loader'
      ]
    });

    // Optimize for real-time RF data processing
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        rf: {
          name: 'rf-chunk',
          test: /[\\/]node_modules[\\/](socket\.io-client|axios|chart\.js)[\\/]/,
          chunks: 'all',
          priority: 10,
        },
        ui: {
          name: 'ui-chunk', 
          test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
          chunks: 'all',
          priority: 9,
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
