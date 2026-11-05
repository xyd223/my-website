// 根布局文件：定义整站共用的 html 结构、语言与页面元信息
import './globals.css';

// 页面元信息（标题、描述等），会渲染到 <head> 中
export const metadata = {
  title: '来自2036年的一封信',
  description: '一封写给此刻的你、来自未来的温柔来信。轻触夜空中的星星，也许会有惊喜。',
};

// 根布局：所有页面都会被包裹在这里
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      {/* 主体内容由各页面注入 */}
      <body>{children}</body>
    </html>
  );
}
