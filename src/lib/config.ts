export const PROFILE_TABLE = 'wsw_yantao_profiles';

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseAdminConfig extends SupabasePublicConfig {
  serviceRoleKey: string;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const publicConfig = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicConfig || !serviceRoleKey) return null;
  return { ...publicConfig, serviceRoleKey };
}

export function getAuthUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.wsw.wiki');
}

export function getCookieDomain() {
  return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.wsw.wiki';
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export function getAbsoluteUrl(path = '/') {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function getLoginUrl(redirectPath = '/') {
  const url = new URL('/login', getAuthUrl());
  const redirectTo = redirectPath.startsWith('http')
    ? redirectPath
    : getAbsoluteUrl(redirectPath);

  url.searchParams.set('redirect_to', redirectTo);
  return url.toString();
}

export function getSharedCookieOptions() {
  if (process.env.NODE_ENV !== 'production') {
    return {
      path: '/',
      sameSite: 'lax' as const,
      secure: false,
    };
  }

  return {
    domain: getCookieDomain(),
    path: '/',
    sameSite: 'lax' as const,
    secure: true,
  };
}
