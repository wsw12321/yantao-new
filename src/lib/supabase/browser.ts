'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSharedCookieOptions, getSupabasePublicConfig } from '../config';

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createBrowserClient(config.url, config.anonKey, {
    cookieOptions: getSharedCookieOptions(),
  });
}
