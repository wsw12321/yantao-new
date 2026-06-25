import type { SupabaseClient, User } from '@supabase/supabase-js';
import { PROFILE_TABLE } from './config';

export type SiteRole = 'member' | 'moderator' | 'admin';

export interface SiteProfile {
  user_id: string;
  username: string;
  role: SiteRole;
  level: number;
  coins: number;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{1,24}$/;

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username);
}

export function normalizeUsername(value: string) {
  return value.trim().replace(/\s+/g, '');
}

export function normalizeBio(value: string) {
  return value.trim().slice(0, 160);
}

export function getLevelName(level: number) {
  if (level >= 5) return '基本粒子';
  if (level === 4) return '夸克候选';
  if (level === 3) return '研究员';
  if (level === 2) return '活跃社员';
  return '新社员';
}

export function getDefaultUsername(user: User) {
  const metadata = user.user_metadata || {};
  const fromMetadata =
    typeof metadata.username === 'string' ? metadata.username :
    typeof metadata.name === 'string' ? metadata.name :
    typeof metadata.full_name === 'string' ? metadata.full_name :
    '';

  const fromEmail = user.email?.split('@')[0] || '';
  const candidate = normalizeUsername(fromMetadata || fromEmail || `yt_${user.id.slice(0, 8)}`);

  if (isValidUsername(candidate)) {
    return candidate.slice(0, 24);
  }

  return `yt_${user.id.slice(0, 8)}`;
}

export function isPrivilegedRole(role: string | null | undefined) {
  return role === 'admin' || role === 'moderator';
}

export function isAdminRole(role: string | null | undefined) {
  return role === 'admin';
}

export async function ensureSiteProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<SiteProfile> {
  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (data) return data as SiteProfile;

  if (error) {
    console.error('Failed to read wsw-yantao profile:', error);
  }

  const now = new Date().toISOString();
  const defaults = {
    user_id: user.id,
    username: getDefaultUsername(user),
    role: 'member',
    level: 1,
    coins: 0,
    avatar_url: null,
    bio: '',
  } satisfies Omit<SiteProfile, 'created_at' | 'updated_at'>;

  const { data: created, error: createError } = await supabase
    .from(PROFILE_TABLE)
    .insert({
      user_id: defaults.user_id,
      username: defaults.username,
      avatar_url: defaults.avatar_url,
      bio: defaults.bio,
    })
    .select('*')
    .single();

  if (created) return created as SiteProfile;

  console.error('Failed to create wsw-yantao profile:', createError);

  return {
    ...defaults,
    created_at: now,
    updated_at: now,
  };
}
