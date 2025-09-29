/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now stable in Next.js 14
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: 'rf-ui-portal',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
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
