import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSharedCookieOptions, getSupabasePublicConfig } from '../config';

export async function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  const cookieStore = await cookies();
  const sharedCookieOptions = getSharedCookieOptions();

  return createServerClient(config.url, config.anonKey, {
    cookieOptions: sharedCookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              ...sharedCookieOptions,
            });
          });
        } catch {
          // Server Components can read cookies but cannot always write refreshed
          // tokens. The proxy refresh path handles writes for normal requests.
        }
      },
    },
  });
}
