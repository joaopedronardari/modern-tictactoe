/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  // Add custom webpack config to ignore certain data attributes
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: [
        {
          loader: 'string-replace-loader',
          options: {
            search: 'data-gr-ext-installed|data-new-gr-c-s-check-loaded',
            replace: '',
            flags: 'g'
          }
        }
      ]
    });
    return config;
  }
}

module.exports = nextConfig
