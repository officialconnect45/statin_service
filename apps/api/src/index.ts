import "dotenv/config"; // must be first — loads .env before anything else
import express from "express";
import cors from "cors";
import helmet from "helmet";
import chalk from "chalk";
import { router } from "./routes/index.js";
import { connectDB } from "./db/connect.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// ── Origins allowed to call the API ─────────────────────────────────────────
// Set ALLOWED_ORIGINS in .env as a comma-separated list:
//   ALLOWED_ORIGINS=http://localhost:3000,https://statin.com
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "https://statin.com"];

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server (no origin) and listed origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Body parsing ──────────────────────────────────────────────────────────────
// Testimonial saves can carry an uploaded logo (up to 500 KB, base64-encoded).
// Parsed here first; the general parser below skips already-parsed bodies.
app.use("/api/v1/admin/testimonials", express.json({ limit: "1mb" }));
app.use("/api/v1/admin/outreach", express.json({ limit: "256kb" }));
app.use("/api/v1/admin/mail-templates", express.json({ limit: "256kb" }));
app.use(express.json({ limit: "64kb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/v1", router);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Bootstrap: connect DB first, then start listening ────────────────────────
async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(chalk.bold.cyan(`\n  🚀 API Server running → http://localhost:${PORT}\n`));
    });
  } catch (err) {
    console.error("\x1b[31m[api] Failed to connect to MongoDB:\x1b[0m", err);
    process.exit(1);
  }
}

bootstrap();

export default app;

