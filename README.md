# wsw-yantao-next

Next.js 重构版研讨物理社网站。项目保留原首页内容，并接入 `auth.water555.com` / Supabase 作为跨站统一账号系统。

## 开发模式

### 连接远程 Supabase

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

`pnpm dev` 保留真实认证流程，并读取 `.env.local` 中的远程 Supabase 配置。未配置 Supabase 环境变量时，首页仍可正常构建和预览；登录、资料和管理功能会提示需要配置环境变量。生产部署变量可参考 `.env.production.example`。

### 使用完整本地 Supabase

本地数据库模式同时在本机运行 Supabase Auth 和 Postgres，不会访问远程 Supabase。开始前需要安装 Docker；在 WSL 中使用 Docker Desktop 时，还需为当前发行版启用 WSL integration，并确认 `docker version` 可正常运行。
本地站点固定使用 `http://localhost:3000` 以匹配认证回调；启动前请确保该端口空闲。

```sh
pnpm install
pnpm dev:local          # 自动登录本地管理员
pnpm dev:local:member   # 自动登录本地普通成员
```

开发启动器会启动本地 Supabase、应用 migration、准备测试账号，并把本地 URL 和密钥直接注入 Next.js 进程；无需修改 `.env.local`，其中的远程配置也不会被覆盖。

本地数据在停止和重启后默认保留。也可以单独管理数据库：

```sh
pnpm db:start
pnpm db:stop
pnpm db:reset
```

`pnpm db:reset` 会清空本地数据、重新应用 migration，并重建管理员和普通成员测试账号。自动登录仅在本地开发命令中启用，因此点击退出后，下一个请求会立即登录回当前命令对应的测试账号；如需验证真实退出或远程认证流程，请改用 `pnpm dev`。

## 账号模型

- 同一个 Supabase project 保存全局账号、邮箱、密码、共享登录 Cookie 和本站业务资料。
- 代码仍按逻辑分离实现：Auth client 只处理登录态，Business client 只在 Next 服务端用 service role 访问 `wsw_yantao_profiles`。
- 同一个全局账号可以在不同站点拥有不同的用户名、角色、等级和金币。

## 数据库

在 Supabase project 的 SQL Editor 中执行：

1. `supabase/migrations/20260719000000_create_wsw_yantao_profiles.sql`
2. `supabase/verify_setup.sql`

首个管理员登录并创建 profile 后，编辑并执行 `supabase/bootstrap_admin.sql`。

完整配置步骤见 `docs/supabase-single-project-setup.md`。

生产环境还需要配置：

- `NEXT_PUBLIC_AUTH_SUPABASE_URL`
- `NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY`
- `BUSINESS_SUPABASE_URL`（单 project 模式可留空，默认复用 `NEXT_PUBLIC_AUTH_SUPABASE_URL`）
- `BUSINESS_SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_AUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_COOKIE_DOMAIN`
