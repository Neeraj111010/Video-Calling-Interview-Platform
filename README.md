# TalentIQ - MERN Interview Platform

TalentIQ is a full-stack MERN interview practice platform for live pair-programming sessions.
It combines problem solving, real-time video + chat, and in-browser code execution in a single workspace.

## Overview

The project is split into:

- `frontend/` - React + Vite client app
- `backend/` - Express API, auth middleware, session management, Stream + Inngest integrations

In production, the backend serves the built frontend (`frontend/dist`) as static files.

## Core Features

- Clerk authentication (sign in/up + protected routes)
- Session creation with selected problem and difficulty
- Active session discovery and recent session history
- Real-time collaborative interview room:
  - Stream Video call
  - Stream Chat channel
  - Shared interview problem view
- In-browser code editor (Monaco)
- Code execution via Piston API (JavaScript, Python, Java)
- Session lifecycle controls:
  - join active session
  - host-only end session
  - automatic redirect on completion
- Background user sync/deletion using Inngest functions triggered by Clerk events

## Tech Stack

- Frontend: React 19, Vite, React Router, TanStack Query, Tailwind CSS, DaisyUI, Stream Video/Chat SDK
- Backend: Node.js, Express, Mongoose, Clerk Express, Inngest, Stream Node SDK
- Database: MongoDB
- External Services: Clerk, Stream, Inngest, Piston API

## Prerequisites

Install before running locally:

- Node.js 18+
- npm 9+
- MongoDB Atlas (or local MongoDB)
- Clerk account and app
- Stream account (Chat + Video enabled)
- Inngest account/project

## Environment Variables

Create env files for backend and frontend.

### Backend env (`backend/.env`)

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority

CLIENT_URL=http://localhost:5173

STREAM_API_KEY=<stream_api_key>
STREAM_API_SECRET=<stream_api_secret>

INNGEST_EVENT_KEY=<inngest_event_key>
INNGEST_SIGNING_KEY=<inngest_signing_key>

# Required by @clerk/express
CLERK_SECRET_KEY=<clerk_secret_key>
```

### Frontend env (`frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>
VITE_STREAM_API_KEY=<stream_api_key>
VITE_API_BASE_URL=http://localhost:3000/api
```

## Local Setup

1. Clone and enter the repository:

```bash
git clone https://github.com/coughlmao/MERN-Interview-Platform-talent-IQ.git
cd MERN-Interview-Platform-talent-IQ
```

2. Install dependencies for all parts:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

3. Add env files:

- `backend/.env`
- `frontend/.env`

4. Start backend (terminal 1):

```bash
npm run dev --prefix backend
```

5. Start frontend (terminal 2):

```bash
npm run dev --prefix frontend
```

6. Open app:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3000/health`

## Render Deployment (Single Service)

This repository is ready for a single Render Web Service deployment where the backend serves the frontend build.

### 1) Create Render Web Service

- Connect this GitHub repository in Render
- Service Type: Web Service
- Branch: your deployment branch (usually `main`)

### 2) Build and Start commands

- Build Command:

```bash
npm run build
```

- Start Command:

```bash
npm start
```

These use root `package.json` scripts:

- `build` installs backend + frontend deps and runs frontend build
- `start` runs backend server

### 3) Set Environment Variables in Render

Add the following in Render service settings:

- `NODE_ENV=production`
- `PORT` (Render injects this automatically, but do not hardcode another port)
- `DB_URL`
- `CLIENT_URL=https://<your-render-service>.onrender.com`
- `STREAM_API_KEY`
- `STREAM_API_SECRET`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `CLERK_SECRET_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_STREAM_API_KEY`
- `VITE_API_BASE_URL=/api`

Important: `VITE_*` variables are used at frontend build time. They must be present in Render before build runs.

### 4) Configure Clerk for production

In Clerk dashboard:

- Add your Render URL to allowed origins/redirect URLs
- Set webhook(s) for user create/delete flows to your deployed Inngest endpoint if needed

### 5) Redeploy

After env vars are set, trigger a manual deploy (or push a commit) and verify:

- `https://<your-render-service>.onrender.com/health`
- App root URL loads
- Authentication and session creation work

## API Endpoints (High-level)

- `GET /health`
- `GET /api/chats/token` (protected)
- `POST /api/sessions` (protected)
- `GET /api/sessions/active` (protected)
- `GET /api/sessions/my-recent` (protected)
- `GET /api/sessions/:id` (protected)
- `POST /api/sessions/:id/join` (protected)
- `POST /api/sessions/:id/end` (protected)
- `POST /api/inngest` (Inngest function endpoint)

## Scripts

Root:

- `npm run build`
- `npm start`

Backend:

- `npm run dev --prefix backend`
- `npm run start --prefix backend`

Frontend:

- `npm run dev --prefix frontend`
- `npm run build --prefix frontend`
- `npm run preview --prefix frontend`

## Notes

- Session capacity is currently 2 participants max (host + one participant).
- Only the host can end a session.
- Completed sessions are visible in recent sessions.
