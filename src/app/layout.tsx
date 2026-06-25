import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import { getAuthContext } from '@/lib/auth';

export const metadata: Metadata = {
  title: '研讨物理社 YT-Physics',
  description: '一个唯心的唯物主义社团，探索物理的奥妙。',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getAuthContext();

  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <ParticleBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar profile={auth.profile} configured={auth.configured} />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>© {new Date().getFullYear()} YT-Physics. 研讨物理社。探索物理的奥妙。</p>
              <div className="flex gap-4">
                <Link href="/#contact" className="hover:text-blue-700">联系我们</Link>
                <Link href="/dashboard" className="hover:text-blue-700">用户中心</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
