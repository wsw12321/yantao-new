import type { User } from '@supabase/supabase-js';
import { createBusinessSupabaseAdminClient } from './supabase/admin';
import { createAuthServerClient } from './supabase/server';
import { ensureSiteProfile, type SiteProfile } from './profile';

export interface AuthContext {
  configured: boolean;
  authConfigured: boolean;
  businessConfigured: boolean;
  user: User | null;
  profile: SiteProfile | null;
  supabase: ReturnType<typeof createBusinessSupabaseAdminClient>;
}

export async function getAuthContext(): Promise<AuthContext> {
  const authSupabase = await createAuthServerClient();
  const businessSupabase = createBusinessSupabaseAdminClient();

  if (!authSupabase || !businessSupabase) {
    return {
      configured: false,
      authConfigured: Boolean(authSupabase),
      businessConfigured: Boolean(businessSupabase),
      user: null,
      profile: null,
      supabase: businessSupabase,
    };
  }

  const { data, error } = await authSupabase.auth.getUser();

  if (error || !data.user) {
    return {
      configured: true,
      authConfigured: true,
      businessConfigured: true,
      user: null,
      profile: null,
      supabase: businessSupabase,
    };
  }

  const profile = await ensureSiteProfile(businessSupabase, data.user);

  return {
    configured: true,
    authConfigured: true,
    businessConfigured: true,
    user: data.user,
    profile,
    supabase: businessSupabase,
  };
}
