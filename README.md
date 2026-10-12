# Statin — Monorepo

A full-stack monorepo managed with **npm workspaces**.

```
service_statin/
├── apps/
│   ├── web/     – Next.js 16 frontend  (port 3000)
│   └── api/     – Express 4 REST API   (port 4000)
└── packages/
    └── types/   – Shared TypeScript types
```

## Getting started

```bash
# Install all workspace dependencies from the repo root
npm install

# Run both frontend and backend in parallel
npm run dev

# Or run them individually
npm run dev:web
npm run dev:api
```

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@statin/web` | `apps/web` | Next.js marketing & product site |
| `@statin/api` | `apps/api` | Express REST API |
| `@statin/types` | `packages/types` | Shared TypeScript types |

## API

Base URL in development: `http://localhost:4000/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/inquiry` | Submit an inquiry |
