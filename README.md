# Compra tu hogar
Web app for browsing, tracking, and managing real estate properties, helping users and agencies streamline the home-buying process.

Built with:

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- uv (dependency & environment manager)

## Backend Setup

### 🚀 Install `uv`

**Windows (PowerShell)**
```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```
**macOS / Linux**
```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Verify installation:
```
uv --version
```

### 📦 Install dependeces

From backend folder
```bash
cd backend
uv sync
```

### ▶️ Run the Application

```bash
uv run uvicorn app.main:app --reload
```

API will be available at:

- http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

### 🧪 Run Tests

```
uv run pytest
```
