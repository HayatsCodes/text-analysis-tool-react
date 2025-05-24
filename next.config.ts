import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'analysis-app-ruud.onrender.com',
      port: '',
      pathname: '/api/files/word_clouds/**'
    }]
  },
  
};

export default nextConfig;
