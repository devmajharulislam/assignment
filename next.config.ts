import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true

    },
    
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
    
};

export default nextConfig;