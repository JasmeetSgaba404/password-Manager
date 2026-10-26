# Password Manager

A full-stack password vault: sign up, log in, and keep a private list of site credentials that only you can see, edit or delete.

**Live demo:** https://password-manager-frontend-gilt.vercel.app/
The API runs on a free Render instance that sleeps when idle, so the first load can take about 20 seconds.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Redux Toolkit (`createAsyncThunk`), React Router 7, Tailwind CSS 4, Vite, react-hot-toast |
| Backend | Node.js, Express 5, node-postgres (`pg`), bcrypt, jsonwebtoken, cookie-parser, CORS |
| Database | PostgreSQL (Neon) |
| Hosting | Vercel (frontend), Render (API) |

## How authentication works

1. **Sign up.** The browser hashes the master password with SHA-256 before sending it, so the plain password never leaves the device. The server hashes it again with bcrypt (10 salt rounds) and stores only `password_hash`.
2. **Log in.** The server checks the password with `bcrypt.compare`, then signs a JWT (`id`, `email`, 24-hour expiry) and sets it as an **HTTP-only cookie**, which page scripts can't read. In production the cookie is `Secure` and `SameSite=None`, because the frontend (Vercel) and the API (Render) are on different domains. In development it is `SameSite=Lax`.
3. **Protected routes.** The `getToken` middleware verifies the JWT from the cookie and attaches the user to `req.user`. Every vault query is scoped to that user (`WHERE id = $1 AND user_id = $2`), so one user cannot read, edit or delete another user's entries.
4. **Session restore.** On page load the app calls `GET /me`. A valid cookie logs the user straight back in; otherwise the login screen shows.
5. **Log out.** `POST /logout` clears the cookie with the same options it was set with.

All SQL uses parameterised queries (`$1`, `$2`, …), which protects against SQL injection.

## API

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/signup` | – | Create an account |
| POST | `/login` | – | Check credentials, set the session cookie |
| GET | `/me` | cookie | Return the logged-in user |
| GET | `/vault` | cookie | List the user's entries |
| POST | `/vault` | cookie | Add an entry |
| PUT | `/vault/:id` | cookie | Edit an entry (only the owner's) |
| DELETE | `/vault/:id` | cookie | Delete an entry (only the owner's) |
| POST | `/logout` | – | Clear the session cookie |

## Data model

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE vaults (
  id                 SERIAL PRIMARY KEY,
  site_name          TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

## Run it locally

**API**
```bash
cd server
npm install
# create server/.env (never commit it):
#   DATABASE_URL=postgres://...
#   JWT_SECRET=<a long random string>
#   PORT=5005
#   FRONTEND_URL=http://localhost:5173
#   NODE_ENV=development
npm run dev
```

**Frontend**
```bash
cd client
npm install
# create client/.env:
#   VITE_API_URL=http://localhost:5005
npm run dev
```

## Known limitations and next steps

- **Vault entries are not yet encrypted at rest.** The `encrypted_password` column currently stores what the user types. Next step: encrypt each entry in the browser with AES-GCM, using a key derived from the master password (PBKDF2 or Argon2, with its own salt) that is never sent to the server. The server would then only ever store ciphertext.
- No automated tests yet.
- No rate limiting on `/login`.
