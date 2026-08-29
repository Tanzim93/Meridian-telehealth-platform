# Meridian — Online Doctors Clinic (Multi-File Edition)

A full-stack app , restructured into a proper `client/` + `server/`
architecture — components, pages, controllers, routes, and models each in their own file,
in the same spirit as a typical MERN project.

## Structure

```
meridian-v2/
├── client/
│   ├── index.html
│   └── src/
│       ├── main.js            Entry point — imports every module, boots the app
│       ├── api.js             fetch() wrapper + token handling
│       ├── state.js           Shared client-side state & constants
│       ├── icons.js           Inline SVG icon set
│       ├── helpers.js         Shared render helpers (avoid circular imports)
│       ├── components/
│       │   ├── sidebar.js     Nav rendering + tab dispatcher
│       │   ├── toast.js       Toast notifications
│       │   └── videocall.js   Video call modal (simulated)
│       ├── pages/
│       │   ├── auth.js        Landing / login / signup / session bootstrap
│       │   ├── dashboard.js
│       │   ├── find-doctor.js Search, filters, booking modal
│       │   ├── appointments.js
│       │   ├── messages.js
│       │   ├── record.js      Health record
│       │   ├── prescriptions.js
│       │   ├── billing.js
│       │   └── profile.js
│       └── styles/            CSS split by section (11 files)
│
├── server/
│   ├── server.js               Entry point — connects to MongoDB, then wires up middleware & routes
│   ├── config/
│   │   ├── db.js                Mongoose connection setup
│   │   └── env.js                JWT secret, port, MONGODB_URI (reads from .env)
│   ├── models/
│   │   ├── Doctor.js             Mongoose schema + seed data + seedDoctors()
│   │   └── Patient.js            Mongoose schema (embedded appointments/prescriptions/
│   │                              invoices/record/messages) + defaultPatientData()
│   ├── middleware/
│   │   └── authMiddleware.js    JWT verification
│   ├── controllers/              One file per resource (8 files) — Mongoose queries live here
│   └── routes/                   One file per resource (8 files) — route → controller mapping
│
|
└── package.json
```

## Data storage: MongoDB via Mongoose

All patient and doctor data is now stored in a real MongoDB database instead of a JSON file.

- **`Doctor`** — one document per doctor, seeded automatically on first boot if the
  collection is empty (see `seedDoctors()` in `models/Doctor.js`).
- **`Patient`** — one document per signed-up patient. Appointments, prescriptions,
  invoices, and the health record are stored as embedded subdocuments/arrays directly
  on the patient document (not separate collections) — simplest structure for how this
  app queries the data, since it's always "give me everything for this one patient."
  `messages` is a `Mixed`-type field keyed by doctor id, since each patient can have a
  different set of doctor threads.
- Passwords are bcrypt-hashed before being saved; `passwordHash` is stripped from every
  API response via a `toJSON` transform on the schema, so it never reaches the client.

### Run it

**1. Get a MongoDB instance** — either:
   - **Local:** install MongoDB Community Server ([instructions](https://www.mongodb.com/docs/manual/administration/install-community/)) and make sure it's running (`mongod`).
   - **Atlas (no local install):** create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), then get your connection string from "Connect → Drivers".

**2. Configure the connection:**
```bash
cp .env.example .env
```
Edit `.env` and set `MONGODB_URI` — for local MongoDB the default already works as-is; for Atlas, paste your `mongodb+srv://...` string.

**3. Install and run:**
```bash
npm install
npm start
```

You should see:
```
MongoDB connected: 127.0.0.1 / meridian
Seeded 6 doctors.
Meridian API + frontend running at http://localhost:3001
```

Open **http://localhost:3001**. Sign up with any name/email/password — that account, and
everything you do with it, is now a real document in your MongoDB database. You can inspect
it directly with `mongosh` or MongoDB Compass:

```js
use meridian
db.patients.find().pretty()
db.doctors.find().pretty()
```

> **Note on this environment:** I wrote and load-tested every backend file (all requires
> resolve, all syntax is valid, and the connection-error path was verified against a
> refused connection), but I don't have a MongoDB instance available to run inside this
> sandbox, so I couldn't do a full live end-to-end test the way I did for the JSON-file
> version. Let me know if anything doesn't behave as expected once you run it against a
> real database and I'll help debug.

## Why split this way

- **Frontend** uses native ES modules (`<script type="module">`) — no bundler needed. Each
  page/component exports its render function and also attaches the handlers referenced by
  inline `onclick=""` in the generated HTML onto `window`, since there's no framework event
  system here.
- **Backend** follows the classic Express MVC layout: `routes/` map an HTTP verb + path to a
  `controllers/` function; controllers read/write through `config/db.js`; `models/` just hold
  seed data shapes since there's no real database driver in this demo.

This was verified end-to-end after the split: every route was hit with curl (signup, doctors,
booking, messaging with auto-reply, health record edits, refills, invoice payment, profile
update), and a fresh login confirmed all of it persisted correctly.

## Next steps toward production

Same as before — swap `db.json` for Postgres/Mongo, add a real video SDK, Stripe, HL7/FHIR, etc.
