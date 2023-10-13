/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'placekitten.com', 'dummyimage.com', 'picsum.photos'],
  },
};

module.exports = nextConfig;
