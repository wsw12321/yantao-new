'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getAuthSupabasePublicConfig, getSharedCookieOptions } from '../config';

export function createAuthBrowserClient() {
  const config = getAuthSupabasePublicConfig();

  if (!config) {
    throw new Error('Missing NEXT_PUBLIC_AUTH_SUPABASE_URL or NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY');
  }

  return createBrowserClient(config.url, config.anonKey, {
    cookieOptions: getSharedCookieOptions(),
  });
}
