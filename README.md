# hamltail Web Lab

Next.js を中心に、Web開発・UI・テスト・品質改善などを
実際に作りながら検証する実験サイトです。

⚠️ 登録されたテストデータは、毎日 03:00（JST）に自動削除されます。

## Live Demo

🌐 [Webサイトを見る](https://next.hamltail.dev/)

## Tech Stack

| Category       | Technologies                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Frontend       | Next.js, React, TypeScript, Tailwind CSS, next-intl, Three.js, Storybook                       |
| Backend / Data | Prisma, PostgreSQL, Supabase, microCMS                                                         |
| Authentication | Custom authentication (bcryptjs, database-backed sessions, account activation, password reset) |
| Email          | Resend, React Email                                                                            |
| Testing        | Vitest, Playwright, OWASP ZAP, k6, axe-core                                                    |
| Infrastructure | Docker, Vercel, Cloudflare R2, GitHub Actions                                                  |

## Requirements

- Node.js 24
- npm
- Docker Desktop

Node.js のバージョンは `.nvmrc` で管理しています。

## Setup

```bash
nvm use
npm install
```

### Start PostgreSQL

ローカル開発では Docker 上の PostgreSQL を使用します。

```bash
docker compose up -d
```

起動状態を確認します。

```bash
docker compose ps
```

### Stop PostgreSQL

PostgreSQL を停止する場合は、以下を実行します。

```bash
docker compose down
```

### Environment Variables

ローカル開発では `.env.local` を使用します。

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs_sandbox"
```

### Database

マイグレーションを適用し、Prisma Client を生成します。

```bash
npx prisma migrate dev
npx prisma generate
```

### Start Development Server

```bash
npm run dev
```

### Prisma Studio

データベースを確認する場合は Prisma Studio を起動します。

```bash
npx prisma studio
```

## CI

`main` 向けの Pull Request 作成時に、GitHub Actions で以下のチェックを実行します。

- Prettier
- ESLint
- TypeScript
- Vitest
- Playwright
- Next.js Build

## License

このリポジトリは学習・技術検証目的で公開しています。

著作権は作者に帰属します。
無断転載・再配布・商用利用はご遠慮ください。

This repository is published for learning and technical verification purposes.

All rights to the content belong to the author.

Please do not reproduce, redistribute, or use any part of this project for commercial purposes without permission.

## Author

- h-waji (hamltail)
