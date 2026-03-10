/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    // domains: ["localhost", "3.91.105.55"],
    // domains: ["localhost", "103.86.177.4"],
    domains: ["localhost", "192.168.68.108", 'api.onlineking.in'],
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ["@svgr/webpack"],
  //   });
  //   return config;
  // },
};

export default nextConfig;
