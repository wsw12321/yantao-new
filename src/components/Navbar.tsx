import Link from 'next/link';
import { Atom, UserRound } from 'lucide-react';
import { getLoginUrl } from '@/lib/config';
import { getLevelName, type SiteProfile } from '@/lib/profile';
import LogoutButton from './LogoutButton';

interface NavbarProps {
  profile: SiteProfile | null;
  configured: boolean;
}

export default function Navbar({ profile, configured }: NavbarProps) {
  const loginUrl = getLoginUrl('/');

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/84 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Atom className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black text-slate-900 sm:text-lg">
              研讨物理社 YT-Physics
            </span>
            <span className="hidden text-xs font-semibold text-slate-500 sm:block">
              Seminar Physics Club
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
            首页
          </Link>
          <Link href="/#courses" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
            社课
          </Link>
          <Link href="/#members" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
            成员
          </Link>
          <Link href="/#contact" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
            联系我们
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {!configured ? (
            <span className="hidden rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 sm:inline-flex">
              Auth 未配置
            </span>
          ) : null}

          {profile ? (
            <>
              <Link
                href="/dashboard"
                className="focus-ring hidden items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 sm:flex"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
                <span className="text-left">
                  <span className="block max-w-32 truncate text-sm font-black text-slate-900">
                    {profile.username}
                  </span>
                  <span className="block text-xs font-semibold text-blue-700">
                    Lv.{profile.level} {getLevelName(profile.level)}
                  </span>
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-700 shadow-sm sm:hidden"
                aria-label="用户中心"
              >
                <UserRound className="h-4 w-4" />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <a
              href={loginUrl}
              className="focus-ring inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black !text-white shadow-sm transition hover:bg-blue-700"
            >
              登录 / 注册
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
