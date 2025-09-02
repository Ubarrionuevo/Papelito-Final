import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BFL_API_KEY: process.env.BFL_API_KEY || '5d7ceb5a-1731-4d9c-b68c-e87ec381ea72',
  },
};

export default nextConfig;
