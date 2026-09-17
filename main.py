from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.base import init_db
from src.auth.router import router as auth_router
from src.profile.router import router as profile_router
from src.assessment.router import router as learning_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Adaptive Learning Agent API", lifespan=lifespan)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(learning_router)

@app.get("/")
def root():
    return {"status": "Online", "engine": "Adaptive Learning Core"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to your frontend port (e.g., http://localhost:3000) for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)