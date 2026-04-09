from fastapi import FastAPI

app = FastAPI(title="Compra tu Hogar API")


@app.get("/")
def read_root():
    return {"message": "Compra tu Hogar backend is running"}


