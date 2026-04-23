# Compra tu hogar

Web app for browsing, tracking, and managing real estate properties, helping users and agencies streamline the home-buying process.

## 🛠 Tech Stack

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* uv (dependency & environment manager)
* Docker

---

## 🐳 Backend Setup with Docker (Recommended)

### 🔨 Build the image

From the `backend` folder:

```bash
docker build -t compra-tu-hogar-back .
```

---

### ▶️ Run the container

```bash
docker run -p 8000:8000 compra-tu-hogar-back
```

The API will be available at:

* http://localhost:8000
* Swagger docs: http://localhost:8000/docs

---

## 📦 Backend Setup (Local - without Docker)

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

### ▶️ Run the application

```bash
uv run uvicorn app.main:app --reload
```

API will be available at:

* http://127.0.0.1:8000
* Swagger docs: http://127.0.0.1:8000/docs
* ReDoc: http://127.0.0.1:8000/redoc

---

### 🧪 Run tests

```bash
uv run pytest
```

---

## 📁 Project Structure (backend)

```bash
backend/
├── app/
├── pyproject.toml
├── uv.lock
└── Dockerfile
```

---

## 📌 Notes

* Docker ensures a consistent environment across all developers.
* Prefer Docker for development once the full stack (frontend + DB) is integrated.
* Local setup is still useful for debugging and faster iteration.

---
