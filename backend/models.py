from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, Float, Text
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from database import Base

# ==========================================
# SQLAlchemy ORM Models (PostgreSQL / SQLite)
# ==========================================

class DBUserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(64), primary_key=True, index=True)
    diet_type = Column(String(32), default="none")
    allergies = Column(JSON, default=list) # e.g. ["milk", "peanuts"]
    custom_avoid = Column(JSON, default=list)
    sensitivity_level = Column(String(32), default="moderate")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DBScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=True)
    product_name = Column(String(255), nullable=True)
    brand = Column(String(255), nullable=True)
    barcode = Column(String(64), nullable=True, index=True)
    scanned_method = Column(String(32), default="manual")
    risk_level = Column(String(32)) # NOT_SUITABLE, CAUTION, NO_MATCH
    suitability_score = Column(Float, nullable=True)
    raw_text = Column(Text, nullable=True)
    normalized_ingredients = Column(JSON, default=list)
    conflicts = Column(JSON, default=list)
    unresolved_ingredients = Column(JSON, default=list)
    explanation = Column(Text, nullable=True)
    citations = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class DBUnresolvedIngredient(Base):
    __tablename__ = "unresolved_ingredients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    raw_token = Column(String(255), unique=True, index=True)
    frequency = Column(Integer, default=1)
    status = Column(String(32), default="pending") # pending, reviewed, added_to_taxonomy
    first_seen_at = Column(DateTime, default=datetime.utcnow)
    last_seen_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================================
# Pydantic API Schemas
# ==========================================

class UserProfileSchema(BaseModel):
    id: str = "default_user"
    dietType: str = "none" # none, vegan, vegetarian, gluten-free, halal
    allergies: List[str] = Field(default_factory=list)
    customAvoid: List[str] = Field(default_factory=list)
    sensitivityLevel: str = "moderate"

class ScanRequest(BaseModel):
    raw_text: Optional[str] = None
    barcode: Optional[str] = None
    user_profile: Optional[UserProfileSchema] = None
    scanned_method: str = "manual" # barcode, ocr, manual

class NormalizedIngredient(BaseModel):
    raw_token: str
    canonical_name: str
    confidence: float
    allergens: List[str] = Field(default_factory=list)
    dietary_conflicts: List[str] = Field(default_factory=list)
    e_number: Optional[str] = None
    is_derivative: bool = False
    is_unknown: bool = False
    notes: Optional[str] = None

class ConflictItem(BaseModel):
    ingredient: str
    type: str # ALLERGEN, DIETARY, SENSITIVITY, UNKNOWN
    severity: str # CRITICAL, HIGH, MODERATE, LOW
    description: str

class RegulatoryCitation(BaseModel):
    source: str # FDA_21CFR, EFSA, FASTER_ACT
    title: str
    excerpt: str
    url: str
    relevance_score: Optional[float] = None

class AssessmentResponse(BaseModel):
    product_name: Optional[str] = "Scanned Formulation"
    brand: Optional[str] = None
    barcode: Optional[str] = None
    scanned_method: str = "manual"
    risk_level: str # NOT_SUITABLE, CAUTION, NO_MATCH
    suitability_score: Optional[float] = None
    conflicts: List[ConflictItem] = Field(default_factory=list)
    normalized_ingredients: List[NormalizedIngredient] = Field(default_factory=list)
    unresolved_ingredients: List[str] = Field(default_factory=list)
    precautionary_statements: List[str] = Field(default_factory=list)
    explanation: str
    citations: List[RegulatoryCitation] = Field(default_factory=list)
    decision_audit_trail: List[str] = Field(default_factory=list)
    evaluated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
