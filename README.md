# House of Muddugumma

Premium women's ethnic-wear storefront with a customer-facing catalog and
an admin dashboard for managing products, categories, collections,
offers, and banners.

## Stack

- **Backend:** FastAPI + MongoDB (Motor), JWT auth, local disk file storage
- **Frontend:** React 19 + React Router + Tailwind CSS + shadcn/ui components

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + router registration
│   │   ├── config.py        # env-based settings
│   │   ├── database.py      # Mongo connection
│   │   ├── security.py      # auth, JWT, password hashing
│   │   ├── storage.py       # local-disk file storage
│   │   ├── models.py        # pydantic schemas
│   │   ├── seed.py          # first-run bootstrap data
│   │   ├── routers/         # one file per feature area
│   │   └── tests/
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/            # customer + admin pages
    │   ├── components/       # shared UI + shadcn primitives
    │   └── lib/               # API client, state, helpers
    └── .env.example
```

Adding a new feature (e.g. "reviews"): add a schema to
`app/models.py`, a router in `app/routers/reviews.py`, register it in
`app/main.py`, and add the matching page/component on the frontend.
The codebase is intentionally split this way so new features don't
require touching unrelated files.

## Run locally

### 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements-dev.txt
cp .env.example .env
# edit .env: set MONGO_URL to a running MongoDB instance, and set a real JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

You need a MongoDB instance. Easiest options:
- Install MongoDB Community locally, or
- Use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `MONGO_URL`

Optional: seed a couple of demo products —
```bash
python seed_demo.py
```

Run tests:
```bash
pytest
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
yarn install
yarn start
```

The app runs at `http://localhost:3000` and talks to the backend at
whatever `REACT_APP_BACKEND_URL` points to in `frontend/.env`.

### Admin login

The backend creates one admin account on first startup, using
`ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`. Log in at
`/admin/login`, then change the password immediately from
**Admin → Settings**.

## Deploying (Render)

This repo includes a `render.yaml` Blueprint that provisions both
services at once.

1. Push this repo to GitHub (see below).
2. In the [Render dashboard](https://dashboard.render.com), choose
   **New → Blueprint** and point it at your GitHub repo.
3. Render will create two services from `render.yaml`:
   - `app-backend` — the FastAPI API
   - `app-frontend` — the React static site
4. Fill in the environment variables Render prompts for:
   - Backend: `MONGO_URL` (an Atlas connection string), `CORS_ORIGINS`
     (your frontend's Render URL), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
     `JWT_SECRET` is auto-generated for you.
   - Frontend: `REACT_APP_BACKEND_URL` (your backend's Render URL).
5. Deploy. The backend's uploads folder is backed by a small
   persistent disk (declared in `render.yaml`) so uploaded images
   survive redeploys.

You don't have to use the Blueprint — you can also create the two
services manually in the Render dashboard using the same build/start
commands shown in `render.yaml`.

## Push to GitHub

```bash
cd /path/to/this/project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Design reference

`design_guidelines.json` documents the visual language (colors,
typography, spacing) used throughout the frontend — useful context
if you or another developer extend the UI later.

## Security notes

- Real secrets belong only in `backend/.env` (git-ignored) — never
  in `backend/.env.example` or in code.
- Rotate `JWT_SECRET` and the admin password if you ever suspect
  they've been exposed (e.g. shared in a chat, screenshot, or an
  old export of this project). Existing JWTs become invalid the
  moment you change `JWT_SECRET`.
