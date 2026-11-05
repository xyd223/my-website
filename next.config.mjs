/**
 * Next.js 配置文件
 * --------------------------------------------------
 * output: 'export' 会把整个站点打包成纯静态文件（输出到 out/ 目录），
 * 之后可以部署到任意静态托管（GitHub Pages、Vercel、对象存储等）。
 * 这也正好满足“开发一个静态网站”的需求。
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 静态导出时关闭图片优化，避免依赖服务端能力
  images: { unoptimized: true },
};

export default nextConfig;
