const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: "http://80.85.246.168:8080/api/v1/admin/:path*",
      },
    ];
  },
};

export default config;
