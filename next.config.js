/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these modules on the server
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        canvas: false,
        encoding: false,
      };
    }

    // Add transpilation for PDF.js
    config.module.rules.push({
      test: /pdf\.js$/,
      use: 'raw-loader',
    });

    return config;
  },
}

module.exports = nextConfig 