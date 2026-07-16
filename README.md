# Compra tu hogar

Web app for browsing, tracking, and managing real estate properties, helping users and agencies streamline the home-buying process.

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy

### Database
- PostgreSQL

### DevOps & Development
- Docker
- Docker Compose
- uv (dependency & environment manager)

### Observability
- Prometheus
- Grafana

### Testing
- Pytest
- Playwright
- ⁠Cucumber

---

## 🐳 Full Application Setup with Docker (Recommended)

This project uses Docker Compose to run the complete application stack:

* React frontend
* FastAPI backend
* PostgreSQL database

---

## ⚙️ Environment Variables

Before running the project, create a `.env` file in the `backend` & `fronted` directory using the provided template:

```bash
cp .env.example .env
```

For example, fill in the required value `SECRET_KEY` with a random secret.

---

### ▶️ Run the full stack

From the project root:

```bash
docker compose up --build
```

---

### 🌐 Available services

* Frontend: http://localhost:5173
* API: http://localhost:8000
* Swagger docs: http://localhost:8000/docs
* ReDoc: http://localhost:8000/redoc

---

### 🧠 How it works

* `frontend` service → React application
* `backend` service → FastAPI app
* `db` service → PostgreSQL

Internal connection uses:

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
│   │   ├── seeds/
│   │   ├── service/
│   │   └── main.py
│   ├── pyproject.toml
│   ├── uv.lock
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── main.tsx
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔐 Security

* Passwords are hashed using `bcrypt` via `passlib`
* Never store plain-text passwords

---
