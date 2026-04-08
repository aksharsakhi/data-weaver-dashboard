from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Data Weaver"
    DATABASE_URL: str = "sqlite+aiosqlite:///./data_weaver.db"
    
    # Background Tasks used natively (No Celery/Redis needed for Desktop App)
    
    # AI Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_MODEL: str = "llama3"
    
    # File handling
    UPLOAD_DIR: str = "uploads"
    
    class Config:
        env_file = ".env"

settings = Settings()
