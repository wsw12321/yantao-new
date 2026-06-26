export const PROFILE_TABLE = 'wsw_yantao_profiles';

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export interface BusinessSupabaseAdminConfig {
  url: string;
  serviceRoleKey: string;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getAuthSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getBusinessSupabaseAdminConfig(): BusinessSupabaseAdminConfig | null {
  const url = process.env.BUSINESS_SUPABASE_URL || process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL;
  const serviceRoleKey = process.env.BUSINESS_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export function getAuthUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.water555.com');
}

export function getCookieDomain() {
  return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.water555.com';
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://yantao.water555.com';
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

export function isAllowedSiteOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(getSiteUrl()).origin;
  } catch {
    return false;
  }
}
