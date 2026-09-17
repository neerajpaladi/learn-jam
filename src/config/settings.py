from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Database Settings
    DB_URL: str = "sqlite:///./adaptive_learning.db"
    
    # Auth & Security
    JWT_SECRET: str = "supersecret_change_this_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Knowledge Graph & Vector DB Credentials
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    QDRANT_URL: str = "http://localhost:6333"

    # Automatically read values from a local .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Instantiate once to import elsewhere: `from config.settings import settings`
settings = Settings()