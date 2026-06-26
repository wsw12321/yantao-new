'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';

export interface AdminUserRow {
  user_id: string;
  username: string;
  role: string;
  level: number;
  coins: number;
  titles: string[];
  updated_at: string;
}

interface AdminUsersTableProps {
  users: AdminUserRow[];
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [rows, setRows] = useState(users);
  const [status, setStatus] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateRow(userId: string, patch: Partial<AdminUserRow>) {
    setRows((current) => current.map((row) => row.user_id === userId ? { ...row, ...patch } : row));
  }

  async function saveRow(row: AdminUserRow) {
    setSavingId(row.user_id);
    setStatus(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: row.user_id,
          role: row.role,
          level: row.level,
          coins: row.coins,
          titles: row.titles,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || '保存失败');
      }

      if (payload.user) {
        updateRow(row.user_id, payload.user);
      }

      setStatus(`已更新 ${row.username}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSavingId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-bold text-slate-500">
        暂无本站用户资料。用户首次登录后会自动创建。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">用户</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">等级</th>
              <th className="px-4 py-3">金币</th>
              <th className="px-4 py-3">称号</th>
              <th className="px-4 py-3">更新时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.user_id}>
                <td className="px-4 py-3">
                  <div className="font-black text-slate-900">{row.username}</div>
                  <div className="font-mono text-xs text-slate-400">{row.user_id}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={row.role}
                    onChange={(event) => updateRow(row.user_id, { role: event.target.value })}
                    className="focus-ring rounded-lg border border-slate-200 bg-white px-2 py-2 font-bold text-slate-800"
                  >
                    <option value="member">member</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={row.level}
                    onChange={(event) => updateRow(row.user_id, { level: Number(event.target.value) })}
                    className="focus-ring w-20 rounded-lg border border-slate-200 px-2 py-2 font-bold text-slate-800"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={row.coins}
                    onChange={(event) => updateRow(row.user_id, { coins: Number(event.target.value) })}
                    className="focus-ring w-24 rounded-lg border border-slate-200 px-2 py-2 font-bold text-slate-800"
                  />
                </td>
                <td className="px-4 py-3">
                  <textarea
                    value={(row.titles || []).join('\n')}
                    onChange={(event) => updateRow(row.user_id, { titles: event.target.value.split('\n') })}
                    rows={3}
                    placeholder="一行一个称号"
                    className="focus-ring w-56 resize-y rounded-lg border border-slate-200 px-3 py-2 font-semibold leading-6 text-slate-800 placeholder:text-slate-400"
                  />
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-500">
                  {new Date(row.updated_at).toLocaleString('zh-CN')}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => saveRow(row)}
                    disabled={savingId === row.user_id}
                    className="focus-ring inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-black text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {savingId === row.user_id ? '保存中' : '保存'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {status ? (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
          {status}
        </div>
      ) : null}
    </div>
  );
}
