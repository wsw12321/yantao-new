import { NextResponse } from 'next/server';
import { isAllowedSiteOrigin } from '@/lib/config';
import { createAuthServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  if (!isAllowedSiteOrigin(request)) {
    return NextResponse.json({ success: false, message: '请求来源不被允许' }, { status: 403 });
  }

  const supabase = await createAuthServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ success: true });
}
