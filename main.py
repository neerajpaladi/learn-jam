from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.base import init_db
from src.auth.router import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # Creates database tables on startup
    yield

app = FastAPI(title="Adaptive Learning API", lifespan=lifespan)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"status": "Online", "message": "Adaptive Learning API"}