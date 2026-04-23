FROM python:3.12-slim

# Evita problemas con buffers
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install uv

WORKDIR /app

# Copiar archivos de dependencias primero (cache)
COPY pyproject.toml uv.lock* ./

RUN uv sync

# Copiar el resto del código
COPY . .

EXPOSE 8000

# Comando para correr FastAPI
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]