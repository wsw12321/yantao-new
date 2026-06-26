# wsw-yantao-next

Next.js 重构版研讨物理社网站。项目保留原首页内容，并接入 `auth.water555.com` / Supabase 作为跨站统一账号系统。

## 本地开发

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

未配置 Supabase 环境变量时，首页仍可正常构建和预览；登录、资料和管理功能会提示需要配置环境变量。
生产部署变量可参考 `.env.production.example`。

## 账号模型

- 同一个 Supabase project 保存全局账号、邮箱、密码、共享登录 Cookie 和本站业务资料。
- 代码仍按逻辑分离实现：Auth client 只处理登录态，Business client 只在 Next 服务端用 service role 访问 `wsw_yantao_profiles`。
- 同一个全局账号可以在不同站点拥有不同的用户名、角色、等级和金币。

## 数据库

在 Supabase project 的 SQL Editor 中执行：

1. `supabase/schema.sql`
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
