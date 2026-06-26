import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Coins, ShieldCheck, UserRound } from 'lucide-react';
import { PROFILE_TABLE } from '@/lib/config';
import { getAuthContext } from '@/lib/auth';
import { createBusinessSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLevelName, type SiteProfile } from '@/lib/profile';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const auth = await getAuthContext();
  const admin = createBusinessSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="glass-panel rounded-xl p-8">
          <h1 className="text-2xl font-black text-slate-900">资料页需要 Supabase 配置</h1>
          <p className="mt-3 font-semibold text-slate-600">请配置 `.env.local` 后再访问公开资料。</p>
        </div>
      </div>
    );
  }

  const { data } = await admin
    .from(PROFILE_TABLE)
    .select('*')
    .eq('user_id', id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const profile = data as SiteProfile;
  const isOwner = auth.user?.id === profile.user_id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="h-36 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400" />
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-[4.75rem] flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-4xl font-black text-white shadow-lg">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-black !text-white text-slate-900">{profile.username}</h1>
                <p className="mt-1 font-bold text-blue-700">Lv.{profile.level} {getLevelName(profile.level)}</p>
              </div>
            </div>
            {isOwner ? (
              <Link
                href="/dashboard"
                className="focus-ring inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-black !text-white shadow-sm transition hover:bg-slate-700"
              >
                编辑资料
              </Link>
            ) : null}
          </div>

          <p className="mt-6 rounded-xl border border-slate-200 bg-white p-4 font-semibold leading-7 text-slate-600">
            {profile.bio || '这个社员还没有写个性签名。'}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <UserRound className="mb-3 h-5 w-5 text-blue-700" />
              <div className="text-sm font-bold text-slate-500">用户 ID</div>
              <div className="mt-1 break-all font-mono text-xs text-slate-900">{profile.user_id}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <ShieldCheck className="mb-3 h-5 w-5 text-blue-700" />
              <div className="text-sm font-bold text-slate-500">本站角色</div>
              <div className="mt-1 text-xl font-black text-slate-900">{profile.role}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <Coins className="mb-3 h-5 w-5 text-blue-700" />
              <div className="text-sm font-bold text-slate-500">金币</div>
              <div className="mt-1 text-xl font-black text-slate-900">{profile.coins}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
