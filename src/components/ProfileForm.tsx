'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';
import type { SiteProfile } from '@/lib/profile';

interface ProfileFormProps {
  profile: SiteProfile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          avatar_url: avatarUrl || null,
          bio,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || '保存失败');
      }

      setStatus('资料已保存');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-black text-slate-800">
          本站用户名
        </label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm"
          maxLength={24}
          required
        />
        <p className="mt-1 text-xs font-medium text-slate-500">
          支持中文、英文、数字、下划线和短横线，最多 24 个字符。
        </p>
      </div>

      <div>
        <label htmlFor="avatar_url" className="mb-2 block text-sm font-black text-slate-800">
          头像 URL
        </label>
        <input
          id="avatar_url"
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm"
          placeholder="https://..."
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-2 block text-sm font-black text-slate-800">
          个性签名
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className="focus-ring min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm"
          maxLength={160}
          placeholder="写一句只属于研讨物理社的签名"
        />
        <p className="mt-1 text-xs font-medium text-slate-500">{bio.length}/160</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {pending ? '保存中...' : '保存资料'}
        </button>
        {status ? <span className="text-sm font-bold text-slate-600">{status}</span> : null}
      </div>
    </form>
  );
}
