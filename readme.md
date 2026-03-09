# Keep Your Pay Act Calculator

Interactive calculator for estimating the impact of Senator Cory Booker's Keep Your Pay Act.

**Live site:** https://keep-your-pay-act.vercel.app

## Structure

- **frontend/** — Next.js 14 dashboard (Tailwind, React Query, Recharts)
- **backend/** — FastAPI household calculator
- **kypa_calc/** — Core Python calculation logic (microsimulation, household, reform)
- **scripts/** — Data pipeline for precomputed CSV/JSON results

## Getting started

### Frontend

```bash
cd frontend
npm install

npm run dev    # runs on http://localhost:3008
```

### Backend

```bash
cd backend
uv venv
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Generate precomputed data

```bash
python scripts/pipeline.py      # CSVs for national impact tab
python scripts/precompute.py    # JSON for backend aggregate endpoint
```

## Status

Reform parameters wired up (PE policy ID 96180). Precomputed data generated for 2026.
