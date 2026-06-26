import { redirect } from 'next/navigation';
import AdminUsersTable, { type AdminUserRow } from '@/components/AdminUsersTable';
import { getAuthContext } from '@/lib/auth';
import { getLoginUrl, PROFILE_TABLE } from '@/lib/config';
import { isAdminRole } from '@/lib/profile';
import { createBusinessSupabaseAdminClient } from '@/lib/supabase/admin';

export default async function AdminUsersPage() {
  const auth = await getAuthContext();

  if (!auth.configured) {
    redirect('/dashboard');
  }

  if (!auth.user || !auth.profile) {
    redirect(getLoginUrl('/admin/users'));
  }

  if (!isAdminRole(auth.profile.role)) {
    redirect('/dashboard');
  }

  const admin = createBusinessSupabaseAdminClient();
  const { data } = admin
    ? await admin
      .from(PROFILE_TABLE)
      .select('user_id, username, role, level, coins, titles, updated_at')
      .order('updated_at', { ascending: false })
    : { data: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">本站用户管理</h1>
        <p className="mt-2 font-semibold text-slate-600">
          只修改研讨物理社本站资料，不影响其他站点的用户信息。
        </p>
      </div>
      <AdminUsersTable users={(data || []) as AdminUserRow[]} />
    </div>
  );
}
