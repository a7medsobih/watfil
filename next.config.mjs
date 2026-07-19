import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);