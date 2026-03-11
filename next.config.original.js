/** @type {import('next').NextConfig} */

const { supportedHighlightLangs, supportedLocales } = require('./config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 's2.loli.net' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  webpack: (config, { webpack }) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${supportedHighlightLangs.join('|')})$`)
      )
    );
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /^date-fns[/\\]locale$/,
        new RegExp(`\\.[/\\\\](${supportedLocales.join('|')})[/\\\\]index\\.js$`)
      )
    );

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
