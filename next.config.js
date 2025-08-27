/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 사이트 배포용 설정 (필요시 주석 해제)
  // output: 'export',
  // distDir: 'out',

  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ["*.preview.same-app.com"],

  // Build optimizations for faster builds
  compress: false,
  poweredByHeader: false,
  generateEtags: false,

  // Build optimizations
  webpack: (config, { isServer }) => {
    // Reduce bundle analysis overhead for faster builds
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };

    return config;
  },

  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },

  // Experimental features for faster builds
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
