import { createClient } from '@supabase/supabase-js';
import { getBusinessSupabaseAdminConfig } from '../config';

export function createBusinessSupabaseAdminClient() {
  const config = getBusinessSupabaseAdminConfig();
  if (!config) return null;

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
