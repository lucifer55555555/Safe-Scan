from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid

from config import settings
from database import get_db, engine, Base
from models import (
    ScanRequest, AssessmentResponse, UserProfileSchema,
    DBUserProfile, DBScanHistory, DBUnresolvedIngredient
)
from ocr_service import ocr_service
from parser import ingredient_parser
from rules_engine import rules_engine
from rag_engine import rag_engine

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    description="Deterministic Food Safety & Ingredient Verification Engine with Vector RAG & OCR."
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "docs": f"{settings.API_V1_STR}/docs",
        "stack": {
            "framework": "FastAPI (Python)",
            "ocr": "Tesseract / Google ML Kit",
            "vector_db": "ChromaDB / FAISS",
            "llm": "Google Gemini API",
            "database": "PostgreSQL / SQLite"
        }
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "ok",
        "vector_store_status": "ready",
        "rules_engine": "authoritative_active"
    }

# ==========================================
# 01 & 02: INGESTION & OCR ENDPOINT
# ==========================================
@app.post(f"{settings.API_V1_STR}/ocr/extract")
async def extract_ocr(file: UploadFile = File(...)):
    """Extracts raw ingredient text from an uploaded food packaging image."""
    contents = await file.read()
    result = ocr_service.extract_text_from_bytes(contents)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "OCR extraction failed"))
    return result

# ==========================================
# 03: NLP PARSING & TOKENIZATION
# ==========================================
@app.post(f"{settings.API_V1_STR}/parse/ingredients")
def parse_ingredients(text_input: Dict[str, str]):
    raw_text = text_input.get("text", "")
    normalized, unresolved, precautions = ingredient_parser.parse_raw_text(raw_text)
    return {
        "normalized_ingredients": normalized,
        "unresolved_ingredients": unresolved,
        "precautionary_statements": precautions
    }

# ==========================================
# 04 & 05: FULL RAG & SAFETY EVALUATION
# ==========================================
@app.post(f"{settings.API_V1_STR}/assessment/evaluate", response_model=AssessmentResponse)
def evaluate_scan(request: ScanRequest, db: Session = Depends(get_db)):
    """
    Main SafeScan End-to-End Pipeline:
    1. Parse & Normalize Ingredients
    2. Deterministic Safety Evaluation
    3. Regulatory Corpus RAG Retrieval (ChromaDB)
    4. Grounded Explanation Generation (Gemini API)
    5. Persistent History Logging (PostgreSQL / SQLite)
    """
    # 1. Parse tokens
    normalized, unresolved, precautions = ingredient_parser.parse_raw_text(request.raw_text or "")
    
    # 2. Deterministic Rules Evaluation
    risk_level, suitability_score, conflicts, audit_trail = rules_engine.evaluate(
        normalized_ingredients=normalized,
        unresolved_ingredients=unresolved,
        precautionary_statements=precautions,
        user_profile=request.user_profile
    )
    
    # 3. Vector RAG Retrieval
    citations = rag_engine.retrieve_relevant_citations(normalized)
    
    # 4. LLM Grounded Explanation
    explanation = rag_engine.generate_grounded_explanation(
        risk_level=risk_level,
        conflicts=conflicts,
        citations=citations,
        user_profile=request.user_profile
    )

    # 5. Persist to DB History
    scan_id = str(uuid.uuid4())
    db_record = DBScanHistory(
        id=scan_id,
        user_id=request.user_profile.id if request.user_profile else "anonymous",
        raw_text=request.raw_text,
        barcode=request.barcode,
        scanned_method=request.scanned_method,
        risk_level=risk_level,
        suitability_score=suitability_score,
        normalized_ingredients=[n.dict() for n in normalized],
        conflicts=[c.dict() for c in conflicts],
        unresolved_ingredients=unresolved,
        explanation=explanation,
        citations=[c.dict() for c in citations]
    )
    try:
        db.add(db_record)
        # Record unresolved tokens for admin taxonomy review
        for token in unresolved:
            existing = db.query(DBUnresolvedIngredient).filter_by(raw_token=token).first()
            if existing:
                existing.frequency += 1
            else:
                db.add(DBUnresolvedIngredient(raw_token=token))
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Database logging notice: {e}")

    return AssessmentResponse(
        barcode=request.barcode,
        scanned_method=request.scanned_method,
        risk_level=risk_level,
        suitability_score=suitability_score,
        conflicts=conflicts,
        normalized_ingredients=normalized,
        unresolved_ingredients=unresolved,
        precautionary_statements=precautions,
        explanation=explanation,
        citations=citations,
        decision_audit_trail=audit_trail
    )

# ==========================================
# 06: USER PROFILES & ALLERGY MANAGEMENT
# ==========================================
@app.get(f"{settings.API_V1_STR}/profile/{{user_id}}", response_model=UserProfileSchema)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(DBUserProfile).filter(DBUserProfile.id == user_id).first()
    if not profile:
        return UserProfileSchema(id=user_id, allergies=[], dietType="none")
    return UserProfileSchema(
        id=profile.id,
        dietType=profile.diet_type,
        allergies=profile.allergies or [],
        customAvoid=profile.custom_avoid or [],
        sensitivityLevel=profile.sensitivity_level
    )

@app.post(f"{settings.API_V1_STR}/profile", response_model=UserProfileSchema)
def save_user_profile(profile_data: UserProfileSchema, db: Session = Depends(get_db)):
    profile = db.query(DBUserProfile).filter(DBUserProfile.id == profile_data.id).first()
    if profile:
        profile.diet_type = profile_data.dietType
        profile.allergies = profile_data.allergies
        profile.custom_avoid = profile_data.customAvoid
        profile.sensitivity_level = profile_data.sensitivityLevel
    else:
        profile = DBUserProfile(
            id=profile_data.id,
            diet_type=profile_data.dietType,
            allergies=profile_data.allergies,
            custom_avoid=profile_data.customAvoid,
            sensitivity_level=profile_data.sensitivityLevel
        )
        db.add(profile)
    db.commit()
    return profile_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
