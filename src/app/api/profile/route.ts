import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';
import { PROFILE_TABLE } from '@/lib/config';
import { isValidUsername, normalizeBio, normalizeUsername } from '@/lib/profile';

export async function PATCH(request: Request) {
  const auth = await getAuthContext();

  if (!auth.configured || !auth.supabase) {
    return NextResponse.json({ success: false, message: 'Supabase 未配置' }, { status: 503 });
  }

  if (!auth.user) {
    return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as {
    username?: string;
    avatar_url?: string | null;
    bio?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ success: false, message: '请求格式错误' }, { status: 400 });
  }

  const username = normalizeUsername(body.username || '');
  if (!isValidUsername(username)) {
    return NextResponse.json({ success: false, message: '用户名格式不正确' }, { status: 400 });
  }

  const avatarUrl = typeof body.avatar_url === 'string' && body.avatar_url.trim()
    ? body.avatar_url.trim()
    : null;

  if (avatarUrl) {
    try {
      const url = new URL(avatarUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('invalid protocol');
      }
    } catch {
      return NextResponse.json({ success: false, message: '头像 URL 不正确' }, { status: 400 });
    }
  }

  const { data, error } = await auth.supabase
    .from(PROFILE_TABLE)
    .update({
      username,
      avatar_url: avatarUrl,
      bio: normalizeBio(body.bio || ''),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', auth.user.id)
    .select('*')
    .single();

  if (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ success: false, message: '保存失败' }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: data });
}
