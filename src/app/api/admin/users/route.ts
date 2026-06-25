import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { PROFILE_TABLE } from '@/lib/config';
import { isAdminRole, type SiteRole } from '@/lib/profile';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const ALLOWED_ROLES = new Set(['member', 'moderator', 'admin']);

export async function GET() {
  const auth = await getAuthContext();

  if (!auth.user || !auth.profile) {
    return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
  }

  if (!isAdminRole(auth.profile.role)) {
    return NextResponse.json({ success: false, message: '权限不足' }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Service role 未配置' }, { status: 503 });
  }

  const { data, error } = await admin
    .from(PROFILE_TABLE)
    .select('user_id, username, role, level, coins, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: '读取失败' }, { status: 500 });
  }

  return NextResponse.json({ success: true, users: data });
}

export async function PATCH(request: Request) {
  const auth = await getAuthContext();

  if (!auth.user || !auth.profile) {
    return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
  }

  if (!isAdminRole(auth.profile.role)) {
    return NextResponse.json({ success: false, message: '权限不足' }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as {
    user_id?: string;
    role?: SiteRole;
    level?: number;
    coins?: number;
  } | null;

  if (!body?.user_id || !body.role || !ALLOWED_ROLES.has(body.role)) {
    return NextResponse.json({ success: false, message: '请求格式错误' }, { status: 400 });
  }

  const level = Number(body.level);
  const coins = Number(body.coins);

  if (!Number.isInteger(level) || level < 1 || level > 99 || !Number.isInteger(coins) || coins < 0) {
    return NextResponse.json({ success: false, message: '等级或金币数值不正确' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Service role 未配置' }, { status: 503 });
  }

  const { data, error } = await admin
    .from(PROFILE_TABLE)
    .update({
      role: body.role,
      level,
      coins,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', body.user_id)
    .select('user_id, username, role, level, coins, updated_at')
    .single();

  if (error) {
    console.error('Failed to update admin profile fields:', error);
    return NextResponse.json({ success: false, message: '保存失败' }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data });
}
