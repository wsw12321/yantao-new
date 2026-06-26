import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Coins, Crown, ShieldCheck, UserRound } from 'lucide-react';
import ProfileForm from '@/components/ProfileForm';
import { getAuthContext } from '@/lib/auth';
import { getLoginUrl } from '@/lib/config';
import { getLevelName, isAdminRole } from '@/lib/profile';

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        {icon}
      </div>
      <div className="text-sm font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const auth = await getAuthContext();

  if (!auth.configured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="glass-panel rounded-xl p-8">
          <h1 className="text-2xl font-black text-slate-900">需要配置 Supabase</h1>
          <p className="mt-3 font-semibold text-slate-600">
            首页可以离线预览，但用户中心需要 `.env.local` 中的 Supabase 配置。
          </p>
        </div>
      </div>
    );
  }

  if (!auth.user || !auth.profile) {
    redirect(getLoginUrl('/dashboard'));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">YT-Physics Account</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">用户中心</h1>
          <p className="mt-2 font-semibold text-slate-600">
            这里展示的是研讨物理社本站资料，不会影响其他网站的用户名、等级或积分。
          </p>
        </div>
        {isAdminRole(auth.profile.role) ? (
          <Link
            href="/admin/users"
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
          >
            管理用户
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<UserRound className="h-5 w-5" />} label="本站用户名" value={auth.profile.username} />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="本站角色" value={auth.profile.role} />
        <StatCard icon={<Crown className="h-5 w-5" />} label="等级" value={`Lv.${auth.profile.level} ${getLevelName(auth.profile.level)}`} />
        <StatCard icon={<Coins className="h-5 w-5" />} label="金币" value={auth.profile.coins} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-black text-slate-900">全局账号</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div>
              <div className="font-bold text-slate-500">账号 ID</div>
              <div className="mt-1 break-all font-mono text-slate-900">{auth.user.id}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500">邮箱</div>
              <div className="mt-1 font-semibold text-slate-900">{auth.user.email || '未提供'}</div>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 font-semibold text-blue-900">
              登录凭证来自统一账号系统 `auth.water555.com`；本站只保存独立展示资料。
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-black text-slate-900">编辑本站资料</h2>
          <div className="mt-5">
            <ProfileForm profile={auth.profile} />
          </div>
        </section>
      </div>
    </div>
  );
}
