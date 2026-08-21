# ProjectFlow — Backend

REST API for ProjectFlow, a collaborative project management platform (Jira/Trello/Linear-style). Handles organizations, teams, projects, Kanban boards, tasks, comments, attachments, notifications, and role-based access control (RBAC).

---

## Tech Stack

- Node.js, Express 5
- MongoDB with Mongoose (MongoDB Atlas)
- JWT authentication (access + refresh tokens)
- Multer (file uploads — avatars, task attachments)
- helmet, cors, morgan, cookie-parser

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers / business logic
│   ├── middlewares/      # auth, RBAC (roleMiddleware.js), uploads
│   ├── models/            # Mongoose schemas
│   ├── routes/             # Express routers per resource
│   ├── services/            # (scaffolded, not yet used)
│   ├── repositories/        # (scaffolded, not yet used)
│   ├── validators/          # (scaffolded, not yet used)
│   ├── constants/            # (scaffolded, not yet used)
│   ├── utils/
│   ├── app.js                # Express app setup, route mounting
│   └── server.js               # entrypoint — DB connect + listen
├── uploads/                     # user-uploaded files (avatars, attachments), gitignored
├── .env                          # local secrets (not committed)
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- A MongoDB Atlas connection string

### Install

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in `backend/` with:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=development
```

### Run

```bash
npm run dev
```

Runs on `http://localhost:5000`. The frontend (see `../frontend/README.md`) expects this URL and runs on `http://localhost:5173`.

---

## Roles & Permissions

ProjectFlow uses a 5-role system. **Authorization checks are always based on a user's per-organization role** (`Organization.members[].role`), not the global `User.role` field — a user can be an org_admin in one organization and a viewer in another.

| Role | Can do |
|---|---|
| **Super Admin** | Manage everything across the platform |
| **Org Admin** | Create/delete projects, invite/remove members, manage teams |
| **Project Manager** | Create boards, create tasks, assign users, update project |
| **Developer** | View assigned projects, update assigned tasks, comment, upload attachments |
| **Viewer** | Read-only access to projects and tasks |

Enforced via `middlewares/roleMiddleware.js` → `authorize(...allowedRoles)`.

---

## API Overview

Response bodies are always wrapped in a named key (never a bare array), e.g. `{ organizations: [...] }`, `{ task: {...} }`.

| Method | Route | Notes |
|---|---|---|
| POST | `/api/auth/register` | |
| POST | `/api/auth/login` | |
| GET | `/api/auth/me` | |
| PATCH | `/api/auth/profile` | |
| PATCH | `/api/auth/avatar` | multipart, field `avatar` |
| PATCH | `/api/auth/avatar/remove` | |
| PATCH | `/api/auth/change-password` | |
| GET | `/api/projects/organization/:orgId` | |
| GET | `/api/boards/project/:projectId` | 404s if no board exists yet |
| GET | `/api/tasks/board/:boardId` | |
| PATCH | `/api/tasks/:id/move` | body `{ column }` |
| POST | `/api/tasks/:id/attachments` | multipart, field `file` |
| GET | `/api/comments/task/:taskId` | |
| POST | `/api/comments` | body `{ text, task }` |
| GET | `/api/teams/organization/:orgId` | |
| POST | `/api/organizations/:id/members` | org_admin only, body `{ email, role }` |
| DELETE | `/api/organizations/:id/members/:userId` | org_admin only |
| GET | `/api/notifications` | |
| PATCH | `/api/notifications/:id/read` | |
| GET | `/api/health` | health check |

---

## Known Gotchas

- **CORS + static file headers**: uploaded images can be blocked cross-port (`5000` → `5173`) unless `Cross-Origin-Resource-Policy: cross-origin` is set on the `/uploads` static middleware (already handled in `app.js`).
- **Thunder Client's free tier blocks file/multipart uploads** — use `curl.exe` (PowerShell), `Invoke-RestMethod`, or the browser UI to test upload endpoints.
- **PowerShell quoting** can break `curl.exe` commands with escaped JSON — `Invoke-RestMethod` with single-quoted JSON bodies is more reliable on Windows.

---

## Roadmap / Not Yet Built

- `services/` / `repositories/` layers (controllers currently hold business logic directly)
- Team-level role checks and a `removeMemberFromTeam` endpoint
- Full project/task-level permission enforcement per the roles table above
- Additional notification triggers (task assigned, deadline near, task completed)
- Deployment (hosting, production environment variables)
