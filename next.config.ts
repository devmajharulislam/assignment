/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn-staging-nextshop.prospectbdltd.com",
            },
            {
                protocol: "https",
                hostname: "staging-nextshop-backend.prospectbdltd.com",
            },
            {
                // Needed because the CDN redirects to this for placeholder/test images
                protocol: "https",
                hostname: "via.placeholder.com",
            },
        ],
    },
    unoptimized: true,
};

export default nextConfig;