# Compra tu hogar

Web app for browsing, tracking, and managing real estate properties, helping users and agencies streamline the home-buying process.

---

## 🛠 Tech Stack

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* uv (dependency & environment manager)
* Docker & Docker Compose

---

## 📋 Project Management

**Board:** [Jira](https://arodriguezfontana-1776905831869.atlassian.net/jira/software/projects/KAN/boards/1)

---

## 🐳 Full Backend Setup with Docker (Recommended)

This project uses **Docker Compose** to run both:

* FastAPI backend
* PostgreSQL database

---

### ▶️ Run the full stack

From the project root:

```bash
docker compose up --build
```

---

### 🌐 Available services

* API: http://localhost:8000
* Swagger docs: http://localhost:8000/docs
* ReDoc: http://localhost:8000/redoc

---

### 🧠 How it works

* `backend` service → FastAPI app
* `db` service → PostgreSQL
* Internal connection uses:

```text
postgresql+psycopg2://postgres:postgres@db:5432/compra_tu_hogar
```

> ⚠️ Inside Docker, the database host is `db`, not `localhost`.

---

### 💾 Persistence

Database data is stored in a Docker volume:

```yaml
volumes:
  postgres_data:
```

This means:

* Data persists between container restarts
* Data is lost only if the volume is removed

---

## 📦 Backend Setup (Local - without Docker)

---

### 🚀 Install `uv`

**Windows (PowerShell)**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**macOS / Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Verify installation:

```bash
uv --version
```

---

### 📥 Install dependencies

From the `backend` folder:

```bash
cd backend
uv sync
```

---

### ⚙️ Environment variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql+psycopg2://user:password@host:port/db
```

> You can use Supabase or any PostgreSQL instance for local runs.

---

### ▶️ Run the application

```bash
uv run uvicorn app.main:app --reload
```

---

## 🧪 Run tests

```bash
uv run pytest
```

---

## 📁 Project Structure

```bash
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── model/
│   │   ├── schema/
│   │   └── main.py
│   ├── pyproject.toml
│   ├── uv.lock
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔐 Security

* Passwords are hashed using `bcrypt` via `passlib`
* Never store plain-text passwords

---

## 📌 Notes

* Docker setup uses a **local PostgreSQL instance** for development
* External databases (e.g. Supabase) are optional and intended for non-Docker environments
* The app currently creates tables automatically at startup (development only)
* Future improvement: database migrations with Alembic

---

## 🚀 Next Steps

* Add proper error handling (e.g. unique email validation)
* Introduce service layer (business logic separation)
* Add authentication (JWT)
* Integrate Alembic for migrations

---
