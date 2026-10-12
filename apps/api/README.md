# @statin/api

Express.js REST API for the Statin monorepo.

## Development

```bash
npm run dev          # starts with tsx watch (hot-reload)
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/inquiry` | Submit an inquiry |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Port the server listens on |
