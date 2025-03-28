import type { NextConfig } from "next";

interface WebpackConfig {
  resolve: {
    fallback: {
      [key: string]: boolean;
    };
  };
}

interface NextConfigWithWebpack extends NextConfig {
  webpack: (config: WebpackConfig) => WebpackConfig;
}

const nextConfig: NextConfigWithWebpack = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      tls: false,
      net: false,
      child_process: false,
      assert: false,
    };
    return config;
  },
};

export default nextConfig;
