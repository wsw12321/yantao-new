import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthContext();

  if (!auth.configured) {
    return NextResponse.json({
      authenticated: false,
      configured: false,
      message: 'Supabase is not configured',
    }, { status: 503 });
  }

  if (!auth.user || !auth.profile) {
    return NextResponse.json({
      authenticated: false,
      configured: true,
    }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    configured: true,
    user: {
      id: auth.user.id,
      email: auth.user.email,
    },
    profile: auth.profile,
  });
}
