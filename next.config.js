/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.cinema-city.pl',
                port: '',
                pathname: '/xmedia-cw/repo/feats/**',
            },
        ],
    },
};

module.exports = nextConfig
