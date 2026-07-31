/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the finished site can be opened from a folder for the viva,
  // with no dev server and no network. `npm run build` writes ./out.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
