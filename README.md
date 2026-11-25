# Sentinel AI: Governance & Observability Monitor for AI Agents

Sentinel AI is a tactical, local-first Next.js dashboard for observing AI-agent activity, applying adjustable governance policy, reviewing alerts, and exporting audit logs.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To create a production build:

```bash
npm run build
npm run start
```

## Deployment on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Keep the detected Next.js framework settings and deploy. No build configuration is required.

The dashboard defaults to its local rule-based `/api/evaluate` engine. For an optional DistilBERT/FastAPI evaluator, add `EXTERNAL_FASTAPI_URL` in Vercel’s environment variables. Disable **Simulation Mode** in the dashboard to send evaluations to that service; when the service is unavailable, Sentinel safely falls back to local evaluation.

## Architecture

- `app/api/evaluate/route.ts` — typed policy evaluation route with optional FastAPI proxy.
- `components/sentinel-context.tsx` — shared telemetry, alerts, settings, and localStorage persistence.
- `components/sentinel-dashboard.tsx` — operational dashboard, tabs, charts, filtering, and CSV export.
- `lib/scoring.ts` — deterministic policy risk-scoring engine.

All session telemetry and policy settings remain in the browser’s local storage unless your configured external evaluator independently stores data.
