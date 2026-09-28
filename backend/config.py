import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafeScan AI — Food Label & Safety Engine"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # AI & Embeddings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    LLM_MODEL: str = "gemini-2.5-flash"
    
    # Vector Database (Chroma / Pinecone / FAISS)
    CHROMA_PERSIST_DIRECTORY: str = "./data/chroma_db"
    COLLECTION_NAME: str = "fda_efsa_regulatory_corpus"
    
    # Relational Database (PostgreSQL / SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./safescan.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173", "*"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
