# Next.js Sandbox

Next.js の学習・技術検証用リポジトリです。

Next.js や周辺技術を学習・検証し、
次のプロダクト開発へ活かすことを目的としています。

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Docker
- Supabase
- Vercel

## Learning Topics

- App Router
- CRUD
- Authentication
- Prisma ORM
- Supabase
- Server Actions
- Route Handlers
- Vercel Deployment

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

`.env` にデータベース接続情報を設定してください。

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

## License

このリポジトリは学習・技術検証目的で公開しています。

著作権は作者に帰属します。
無断転載・再配布・商用利用はご遠慮ください。

This repository is published for learning and technical verification purposes.

All rights to the content belong to the author.

Please do not reproduce, redistribute, or use any part of this project for commercial purposes without permission.

## Author

- h-waji (hamltail)
