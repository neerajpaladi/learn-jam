from sqlmodel import SQLModel, create_engine, Session
from src.config.settings import settings

# connect_args needed for SQLite
engine = create_engine(settings.DB_URL, connect_args={"check_same_thread": False})

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session