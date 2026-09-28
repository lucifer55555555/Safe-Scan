from typing import List, Tuple, Optional
from models import UserProfileSchema, NormalizedIngredient, ConflictItem

class DeterministicSafetyEngine:
    """
    Authoritative Rule-Based Safety Engine.
    Enforces zero-tolerance FALCPA 9 major allergen triggers,
    strict dietary restrictions (Vegan, Vegetarian, Gluten-Free, Halal),
    and Unknown Ingredient Quarantine.
    """

    @staticmethod
    def evaluate(
        normalized_ingredients: List[NormalizedIngredient],
        unresolved_ingredients: List[str],
        precautionary_statements: List[str],
        user_profile: Optional[UserProfileSchema]
    ) -> Tuple[str, Optional[float], List[ConflictItem], List[str]]:
        
        conflicts: List[ConflictItem] = []
        audit_trail: List[str] = []
        
        if not user_profile:
            user_profile = UserProfileSchema()

        audit_trail.append(f"Input Ingestion: Processed {len(normalized_ingredients)} normalized token(s)")
        audit_trail.append(f"Active Profile: Allergies={user_profile.allergies}, Diet={user_profile.dietType}")

        has_hard_allergen_conflict = False
        has_dietary_violation = False
        has_unknown_ingredient = len(unresolved_ingredients) > 0

        user_allergies = [a.lower() for a in user_profile.allergies]
        user_diet = user_profile.dietType.lower() if user_profile.dietType else "none"

        # 1. Evaluate Direct Allergen Matches
        for item in normalized_ingredients:
            for item_allergen in item.allergens:
                if item_allergen.lower() in user_allergies:
                    has_hard_allergen_conflict = True
                    conflicts.append(ConflictItem(
                        ingredient=item.raw_token,
                        type="ALLERGEN",
                        severity="CRITICAL",
                        description=f"Contains '{item.canonical_name}', triggering declared '{item_allergen.upper()}' allergy."
                    ))

        # 2. Evaluate Dietary Violations (e.g. Vegan, Vegetarian, Gluten-Free, Halal)
        if user_diet != "none":
            for item in normalized_ingredients:
                if user_diet in item.dietary_conflicts:
                    has_dietary_violation = True
                    conflicts.append(ConflictItem(
                        ingredient=item.raw_token,
                        type="DIETARY",
                        severity="HIGH",
                        description=f"'{item.canonical_name}' violates active '{user_diet.upper()}' diet."
                    ))

        # 3. Evaluate Unknown Quarantined Ingredients
        if has_unknown_ingredient:
            for unk in unresolved_ingredients:
                conflicts.append(ConflictItem(
                    ingredient=unk,
                    type="UNKNOWN",
                    severity="MODERATE",
                    description=f"Quarantined unmapped ingredient '{unk}' — unknown safety status."
                ))
            audit_trail.append(f"Quarantine Policy: {len(unresolved_ingredients)} unknown token(s) flagged. Score nullified.")

        # 4. Determine Authoritative Risk Level
        if has_hard_allergen_conflict or has_dietary_violation:
            risk_level = "NOT_SUITABLE"
            suitability_score = 0.0
            audit_trail.append(f"Verdict: NOT_SUITABLE due to direct conflict ({len(conflicts)} conflict(s))")
        elif has_unknown_ingredient:
            risk_level = "CAUTION"
            suitability_score = None  # Unknown != Safe -> Score is suppressed
            audit_trail.append("Verdict: CAUTION due to unmapped quarantined ingredients")
        elif len(precautionary_statements) > 0:
            risk_level = "CAUTION"
            suitability_score = 75.0
            audit_trail.append("Verdict: CAUTION due to precautionary manufacturer cross-contact warning")
        else:
            risk_level = "NO_MATCH"
            suitability_score = 100.0
            audit_trail.append("Verdict: NO_MATCH (Safe & Verified against declared rules)")

        return risk_level, suitability_score, conflicts, audit_trail

rules_engine = DeterministicSafetyEngine()
