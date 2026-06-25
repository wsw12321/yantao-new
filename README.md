# wsw-yantao-next

Next.js 重构版研讨物理社网站。项目保留原首页内容，并接入 `auth.wsw.wiki` / Supabase 作为跨站统一账号系统。

## 本地开发

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

未配置 Supabase 环境变量时，首页仍可正常构建和预览；登录、资料和管理功能会提示需要配置环境变量。

## 账号模型

- Supabase Auth 保存全局账号、邮箱、密码和共享登录 Cookie。
- `wsw_yantao_profiles` 保存本站独立资料。
- 同一个全局账号可以在不同站点拥有不同的用户名、角色、等级和金币。

## 数据库

在 Supabase SQL Editor 中执行 `supabase/schema.sql`。生产环境还需要配置：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_AUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_COOKIE_DOMAIN`
