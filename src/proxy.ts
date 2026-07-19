import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  getAuthSupabasePublicConfig,
  getLocalAutoLoginConfig,
  getSharedCookieOptions,
} from './lib/config';

function localAutoLoginUnavailable(reason: string) {
  console.error(`[local-auto-login] ${reason}`);

  return new NextResponse(`Local auto-login unavailable: ${reason}`, {
    status: 503,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function proxy(request: NextRequest) {
  const localAutoLogin = getLocalAutoLoginConfig();

  if (localAutoLogin.status === 'invalid') {
    return localAutoLoginUnavailable(localAutoLogin.reason);
  }

  const config = getAuthSupabasePublicConfig();

  if (!config) {
    if (localAutoLogin.status === 'enabled') {
      return localAutoLoginUnavailable(
        'NEXT_PUBLIC_AUTH_SUPABASE_URL and NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY are required.',
      );
    }

    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const sharedCookieOptions = getSharedCookieOptions();

  const supabase = createServerClient(config.url, config.anonKey, {
    cookieOptions: sharedCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, {
            ...options,
            ...sharedCookieOptions,
          });
        });
      },
    },
  });

  let getUserResult;

  try {
    getUserResult = await supabase.auth.getUser();
  } catch (error) {
    if (localAutoLogin.status === 'enabled') {
      return localAutoLoginUnavailable(
        `Supabase session check failed: ${getErrorMessage(error)}`,
      );
    }

    throw error;
  }

  const { user } = getUserResult.data;

  if (
    localAutoLogin.status === 'enabled' &&
    user?.id !== localAutoLogin.config.userId
  ) {
    let signInResult;

    try {
      signInResult = await supabase.auth.signInWithPassword({
        email: localAutoLogin.config.email,
        password: localAutoLogin.config.password,
      });
    } catch (error) {
      return localAutoLoginUnavailable(
        `Supabase sign-in failed: ${getErrorMessage(error)}`,
      );
    }

    const { data, error } = signInResult;

    if (error) {
      return localAutoLoginUnavailable(`Supabase sign-in failed: ${error.message}`);
    }

    if (data.user?.id !== localAutoLogin.config.userId) {
      return localAutoLoginUnavailable(
        'The signed-in Supabase user does not match LOCAL_AUTO_LOGIN_USER_ID.',
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
