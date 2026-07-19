#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const SUPABASE_CLI = require.resolve('supabase/dist/supabase.js');
const NEXT_CLI = require.resolve('next/dist/bin/next');
const PROFILE_TABLE = 'wsw_yantao_profiles';

const LOCAL_ACCOUNTS = {
  admin: {
    id: '10000000-0000-4000-8000-000000000001',
    email: 'admin@local.yt-physics.test',
    username: 'local_admin',
    role: 'admin',
  },
  member: {
    id: '10000000-0000-4000-8000-000000000002',
    email: 'member@local.yt-physics.test',
    username: 'local_member',
    role: 'member',
  },
};

function runSupabase(args, { capture = false } = {}) {
  const result = spawnSync(process.execPath, [SUPABASE_CLI, ...args], {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      SUPABASE_TELEMETRY_DISABLED: '1',
    },
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const detail = capture ? (result.stderr || result.stdout).trim() : '';
    throw new Error(
      `supabase ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`,
    );
  }

  return capture ? result.stdout : '';
}

function parseEnvOutput(output) {
  const values = {};

  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const match = /^([A-Z][A-Z0-9_]*)=(.*)$/.exec(line);
    if (!match) continue;

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[match[1]] = value;
  }

  return values;
}

function firstValue(values, keys) {
  for (const key of keys) {
    if (values[key]) return values[key];
  }

  return null;
}

function getLocalSupabaseEnvironment() {
  const values = parseEnvOutput(runSupabase(['status', '-o', 'env'], { capture: true }));
  const apiUrl = firstValue(values, ['API_URL', 'SUPABASE_URL']);
  const anonKey = firstValue(values, [
    'ANON_KEY',
    'PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
  ]);
  const serviceRoleKey = firstValue(values, [
    'SERVICE_ROLE_KEY',
    'SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]);

  if (!apiUrl || !anonKey || !serviceRoleKey) {
    throw new Error(
      'Supabase status did not return API_URL, ANON_KEY/PUBLISHABLE_KEY, and SERVICE_ROLE_KEY/SECRET_KEY.',
    );
  }

  const hostname = new URL(apiUrl).hostname.toLowerCase();
  if (!['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname)) {
    throw new Error(`Refusing to use a non-loopback Supabase URL: ${apiUrl}`);
  }

  return { apiUrl, anonKey, serviceRoleKey };
}

function createLocalAdminClient({ apiUrl, serviceRoleKey }) {
  return createClient(apiUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function randomPassword() {
  return randomBytes(24).toString('base64url');
}

async function ensureAuthUser(supabase, account, password) {
  const { data: existing, error: readError } = await supabase.auth.admin.getUserById(account.id);

  if (readError && readError.status !== 404) {
    throw new Error(`Unable to read ${account.email}: ${readError.message}`);
  }

  const attributes = {
    email: account.email,
    password,
    email_confirm: true,
    user_metadata: { username: account.username },
  };

  if (existing?.user) {
    const { error } = await supabase.auth.admin.updateUserById(account.id, attributes);
    if (error) {
      throw new Error(`Unable to update ${account.email}: ${error.message}`);
    }
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    id: account.id,
    ...attributes,
  });

  if (error) {
    throw new Error(`Unable to create ${account.email}: ${error.message}`);
  }
}

async function ensureProfile(supabase, account) {
  const { data, error: readError } = await supabase
    .from(PROFILE_TABLE)
    .select('user_id')
    .eq('user_id', account.id)
    .maybeSingle();

  if (readError) {
    throw new Error(`Unable to read the ${account.username} profile: ${readError.message}`);
  }

  if (!data) {
    const { error } = await supabase.from(PROFILE_TABLE).insert({
      user_id: account.id,
      username: account.username,
      role: account.role,
    });

    if (error) {
      throw new Error(`Unable to create the ${account.username} profile: ${error.message}`);
    }
    return;
  }

  const { error } = await supabase
    .from(PROFILE_TABLE)
    .update({ role: account.role })
    .eq('user_id', account.id);

  if (error) {
    throw new Error(`Unable to restore the ${account.username} role: ${error.message}`);
  }
}

async function provisionLocalAccounts(localEnvironment) {
  const supabase = createLocalAdminClient(localEnvironment);
  const credentials = {};

  for (const [name, account] of Object.entries(LOCAL_ACCOUNTS)) {
    const password = randomPassword();
    await ensureAuthUser(supabase, account, password);
    await ensureProfile(supabase, account);
    credentials[name] = { ...account, password };
  }

  return credentials;
}

function startLocalStack() {
  console.log('[local-dev] Starting local Supabase...');
  runSupabase(['start']);
  runSupabase(['migration', 'up', '--local']);
}

async function prepareLocalStack() {
  startLocalStack();
  const localEnvironment = getLocalSupabaseEnvironment();
  const credentials = await provisionLocalAccounts(localEnvironment);
  console.log('[local-dev] Local admin and member accounts are ready.');
  return { localEnvironment, credentials };
}

async function runNextDev(accountName, localEnvironment, credentials) {
  const account = credentials[accountName];
  if (!account) {
    throw new Error(`Unknown local account "${accountName}".`);
  }

  const env = {
    ...process.env,
    NODE_ENV: 'development',
    NEXT_PUBLIC_AUTH_SUPABASE_URL: localEnvironment.apiUrl,
    NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY: localEnvironment.anonKey,
    BUSINESS_SUPABASE_URL: localEnvironment.apiUrl,
    BUSINESS_SUPABASE_SERVICE_ROLE_KEY: localEnvironment.serviceRoleKey,
    NEXT_PUBLIC_AUTH_URL: 'http://localhost:3000',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    NEXT_PUBLIC_COOKIE_DOMAIN: '',
    LOCAL_AUTO_LOGIN: 'true',
    LOCAL_AUTO_LOGIN_USER_ID: account.id,
    LOCAL_AUTO_LOGIN_EMAIL: account.email,
    LOCAL_AUTO_LOGIN_PASSWORD: account.password,
  };

  console.log(`[local-dev] Starting Next.js as ${account.username} (${account.role}).`);

  // Keep this explicit: Next otherwise falls back to 3001 when 3000 is busy,
  // while Supabase redirect and same-origin settings still point at 3000.
  const child = spawn(process.execPath, [NEXT_CLI, 'dev', '--port', '3000'], {
    cwd: PROJECT_ROOT,
    env,
    stdio: 'inherit',
  });

  const signalHandlers = new Map(
    ['SIGINT', 'SIGTERM'].map((signal) => {
      const handler = () => {
        if (!child.killed) child.kill(signal);
      };
      process.once(signal, handler);
      return [signal, handler];
    }),
  );

  const exit = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolve({ code, signal }));
  });

  for (const [signal, handler] of signalHandlers) {
    process.removeListener(signal, handler);
  }

  if (exit.signal) {
    process.kill(process.pid, exit.signal);
    return;
  }

  process.exitCode = exit.code ?? 1;
}

async function main() {
  const [action, accountName = 'admin'] = process.argv.slice(2);

  if (action === 'start') {
    await prepareLocalStack();
    return;
  }

  if (action === 'reset') {
    console.log('[local-dev] Resetting local Supabase data...');
    runSupabase(['start']);
    runSupabase(['db', 'reset', '--local']);
    const localEnvironment = getLocalSupabaseEnvironment();
    await provisionLocalAccounts(localEnvironment);
    console.log('[local-dev] Local database and test accounts were reset.');
    return;
  }

  if (action === 'stop') {
    console.log('[local-dev] Stopping local Supabase...');
    runSupabase(['stop']);
    return;
  }

  if (action === 'dev') {
    const { localEnvironment, credentials } = await prepareLocalStack();
    await runNextDev(accountName, localEnvironment, credentials);
    return;
  }

  throw new Error('Usage: local-supabase.mjs <start|stop|reset|dev> [admin|member]');
}

main().catch((error) => {
  console.error(`[local-dev] ${error instanceof Error ? error.message : String(error)}`);
  console.error('[local-dev] Ensure Docker is running and `docker version` succeeds in this shell.');
  process.exitCode = 1;
});
