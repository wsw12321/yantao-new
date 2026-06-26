import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Crown, UserRound, UsersRound } from 'lucide-react';
import { PROFILE_TABLE } from '@/lib/config';
import { getLevelName, type SiteProfile } from '@/lib/profile';
import { createBusinessSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '成员名单 | 研讨物理社 YT-Physics',
  description: '研讨物理社本站成员名单与等级标签。',
};

type MemberProfile = Pick<SiteProfile, 'user_id' | 'username' | 'level' | 'bio' | 'created_at'>;

function getLevelBadgeClass(level: number) {
  if (level >= 5) return 'border-violet-200 bg-violet-50 text-violet-800';
  if (level === 4) return 'border-blue-200 bg-blue-50 text-blue-800';
  if (level === 3) return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (level === 2) return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function MembersPage() {
  const admin = createBusinessSupabaseAdminClient();

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="glass-panel rounded-xl p-8">
          <h1 className="text-2xl font-black text-slate-900">成员名单需要 Supabase 配置</h1>
          <p className="mt-3 font-semibold text-slate-600">
            首页可以离线预览，但成员名单需要 `.env.local` 中的 Supabase 配置。
          </p>
        </div>
      </div>
    );
  }

  const { data, error } = await admin
    .from(PROFILE_TABLE)
    .select('user_id, username, level, bio, created_at')
    .order('level', { ascending: false })
    .order('created_at', { ascending: true });

  const members = (data || []) as MemberProfile[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/#members"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-0 py-2 text-sm font-black text-blue-700 transition hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回发展历史
          </Link>
          <p className="mt-4 text-sm font-black uppercase tracking-wide text-blue-700">YT-Physics Members</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">成员名单</h1>
          <p className="mt-2 max-w-2xl font-semibold leading-7 text-slate-600">
            展示已创建本站资料的研讨物理社成员，并按等级从高到低排列。
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <UsersRound className="h-5 w-5 text-blue-700" />
          <span className="text-sm font-bold text-slate-500">全部成员</span>
          <span className="text-2xl font-black text-slate-900">{members.length}</span>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 font-bold text-amber-900">
          成员名单暂时无法读取，请稍后再试。
        </div>
      ) : null}

      {members.length === 0 ? (
        <div className="glass-panel rounded-xl p-10 text-center">
          <UserRound className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <h2 className="text-xl font-black text-slate-900">暂无成员资料</h2>
          <p className="mt-2 font-semibold text-slate-600">用户首次登录后会自动创建本站资料。</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.user_id}
              href={`/profile/${member.user_id}`}
              className="focus-ring group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-slate-900">{member.username}</h2>
                    <p className="mt-0.5 text-xs font-bold text-slate-500">加入于 {formatDate(member.created_at)}</p>
                  </div>
                </div>
                <Crown className="h-5 w-5 shrink-0 text-blue-700 transition group-hover:scale-110" />
              </div>

              <div className="mt-4">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${getLevelBadgeClass(member.level)}`}>
                  Lv.{member.level} {getLevelName(member.level)}
                </span>
              </div>

              <p className="mt-4 line-clamp-2 min-h-[3.5rem] font-semibold leading-7 text-slate-600">
                {member.bio || '这个社员还没有写个性签名。'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
