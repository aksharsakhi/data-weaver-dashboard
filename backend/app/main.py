from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.api.sessions import router as session_router
from app.core.database import engine, Base

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to create tables if they don't exist
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # For production, use Alembic migrations instead of Base.metadata.create_all
        await conn.run_sync(Base.metadata.create_all)

# Register routers
app.include_router(session_router, prefix="/api/sessions", tags=["sessions"])

@app.get("/")
async def root():
    return {"message": "Welcome to Data Weaver API. Access /docs for API documentation."}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
