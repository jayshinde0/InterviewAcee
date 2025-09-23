/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['mongoose', 'mongodb', '@mongodb-js/zstd', 'kerberos', 'snappy', 'aws4', 'mongodb-client-encryption', 'bson', 'http-proxy-agent', 'https-proxy-agent'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        zlib: false,
        http2: false,
        http: false,
        https: false,
        stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
        crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
        path: path.resolve(__dirname, 'node_modules/path-browserify'),
        os: path.resolve(__dirname, 'node_modules/os-browserify/browser'),
      };
    }
    return config;
  },
}

export default nextConfig
