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
| POST | `/api/v1/inquiry` | Submit an inquiry (stored in MongoDB) |
| GET | `/api/v1/inquiries` | List stored inquiries, newest first. Requires `Authorization: Bearer <ADMIN_API_KEY>` |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Port the server listens on |
| `MONGO_URI` | | MongoDB connection string |
| `ADMIN_API_KEY` | | Key for admin endpoints; same value as the web app's `ADMIN_API_KEY` |
