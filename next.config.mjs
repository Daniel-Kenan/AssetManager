import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: false, images: {
    domains: ['localhost','nextgensell.com'],
  },};


const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  ...nextConfig
});