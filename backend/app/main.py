from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import ai, history

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CodeAI Backend API",
    description="Modern REST API for AI-Powered Code Generator",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(ai.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CodeAI Backend",
        "openai_configured": bool(settings.OPENAI_API_KEY.strip()),
        "model": settings.OPENAI_MODEL
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to CodeAI API! Visit /docs for interactive Swagger API documentation."
    }
