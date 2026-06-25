import type { User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from './supabase/server';
import { ensureSiteProfile, type SiteProfile } from './profile';

export interface AuthContext {
  configured: boolean;
  user: User | null;
  profile: SiteProfile | null;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      configured: false,
      user: null,
      profile: null,
      supabase: null,
    };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      configured: true,
      user: null,
      profile: null,
      supabase,
    };
  }

  const profile = await ensureSiteProfile(supabase, data.user);

  return {
    configured: true,
    user: data.user,
    profile,
    supabase,
  };
}
