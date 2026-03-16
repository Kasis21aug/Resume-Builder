# Resume Builder — React + Node.js + Supabase

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React.js, React Router  |
| Backend    | Node.js, Express.js     |
| Database   | Supabase (PostgreSQL)   |
| Auth       | JWT (jsonwebtoken)      |
| AI         | OpenAI GPT-3.5 Turbo    |
| PDF Export | html2pdf.js             |

---

## Setup — Step by Step

### Step 1 — Create Supabase project (free, no card)

1. Go to **supabase.com** → Sign up with GitHub
2. Click **New Project**
3. Enter a name: `resume-builder`
4. Set a database password (save this somewhere)
5. Choose any region → click **Create Project** (takes ~1 minute)

### Step 2 — Create the database tables

1. In Supabase dashboard → click **SQL Editor** in left sidebar
2. Click **New Query**
3. Open the file `SUPABASE_SETUP.sql` from this project
4. Copy everything and paste it into the SQL Editor
5. Click **Run** (green button)
6. You should see "Success. No rows returned"
7. Click **Table Editor** in left sidebar — you should see `users` and `resumes` tables

### Step 3 — Get your Supabase keys

1. In Supabase dashboard → **Project Settings** (gear icon) → **API**
2. Copy **Project URL** → this is your `SUPABASE_URL`
3. Copy **service_role** key (under "Project API keys", click reveal) → this is your `SUPABASE_SERVICE_KEY`

### Step 4 — Create your .env file

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...your-service-role-key
JWT_SECRET=any_long_random_string_like_abc123xyz789
OPENAI_API_KEY=sk-your-key  (optional)
```

### Step 5 — Run the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Supabase connected successfully!
🚀 Server running at http://localhost:5000
```

### Step 6 — Run the frontend

```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000** → Register → Create Resume → Done!

---

## Features

- Register / Login with JWT auth
- Create, edit, delete multiple resumes
- 3 templates: Classic (free), Modern (free), Premium (locked)
- Live preview as you type
- AI: generate summary, improve bullets, suggest skills
- Download resume as PDF
- Simulated premium upgrade

---

## API Endpoints

| Method | Route              | Auth | Description       |
|--------|--------------------|------|-------------------|
| POST   | /api/auth/register | No   | Create account    |
| POST   | /api/auth/login    | No   | Login, get token  |
| PUT    | /api/auth/upgrade  | Yes  | Unlock premium    |
| GET    | /api/resumes       | Yes  | All user resumes  |
| GET    | /api/resumes/:id   | Yes  | One resume        |
| POST   | /api/resumes       | Yes  | Create resume     |
| PUT    | /api/resumes/:id   | Yes  | Update resume     |
| DELETE | /api/resumes/:id   | Yes  | Delete resume     |
| POST   | /api/ai/generate   | Yes  | AI content        |

---

## Assumptions

- Premium upgrade is simulated (no real payment). In production, Stripe would be used.
- AI features require a valid OpenAI API key in .env. All other features work without it.
- JWT auth is handled manually in Node.js (not using Supabase Auth) for full control.
- Row Level Security is disabled in Supabase — security is enforced in the Node.js controllers.
