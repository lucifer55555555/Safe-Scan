import re
from typing import List, Dict, Any, Tuple
from models import NormalizedIngredient

# Canonical Taxonomy & Known Allergen / Dietary Mappings
CANONICAL_TAXONOMY: Dict[str, Dict[str, Any]] = {
    # Dairy / Milk Derivatives
    "milk": {"canonical": "Cow's Milk", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": False},
    "whey": {"canonical": "Whey Protein", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "casein": {"canonical": "Casein Protein", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "sodium caseinate": {"canonical": "Sodium Caseinate", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "butter": {"canonical": "Butter", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "ghee": {"canonical": "Clarified Butter (Ghee)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "lactose": {"canonical": "Lactose", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "cheese": {"canonical": "Cheese", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "cream": {"canonical": "Dairy Cream", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    
    # Peanuts & Tree Nuts
    "peanut": {"canonical": "Peanuts", "allergens": ["peanuts"], "dietary": [], "is_derivative": False},
    "peanuts": {"canonical": "Peanuts", "allergens": ["peanuts"], "dietary": [], "is_derivative": False},
    "peanut butter": {"canonical": "Peanut Butter", "allergens": ["peanuts"], "dietary": [], "is_derivative": True},
    "almond": {"canonical": "Almond", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "almonds": {"canonical": "Almonds", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "cashew": {"canonical": "Cashew Nuts", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "walnut": {"canonical": "Walnuts", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "hazelnut": {"canonical": "Hazelnuts", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "pistachio": {"canonical": "Pistachios", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},

    # Wheat / Gluten
    "wheat": {"canonical": "Wheat Flour", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": False},
    "wheat flour": {"canonical": "Enriched Wheat Flour", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": False},
    "semolina": {"canonical": "Semolina (Durum Wheat)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},
    "barley": {"canonical": "Barley Malt", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": False},
    "rye": {"canonical": "Rye Flour", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": False},
    "vital wheat gluten": {"canonical": "Vital Wheat Gluten", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},

    # Soy
    "soy": {"canonical": "Soybeans", "allergens": ["soybeans"], "dietary": [], "is_derivative": False},
    "soy lecithin": {"canonical": "Soy Lecithin (E322)", "allergens": ["soybeans"], "dietary": [], "e_number": "E322", "is_derivative": True},
    "e322": {"canonical": "Soy Lecithin (E322)", "allergens": ["soybeans"], "dietary": [], "e_number": "E322", "is_derivative": True},
    "tofu": {"canonical": "Tofu (Soy Curd)", "allergens": ["soybeans"], "dietary": [], "is_derivative": True},

    # Eggs
    "egg": {"canonical": "Whole Eggs", "allergens": ["eggs"], "dietary": ["vegan"], "is_derivative": False},
    "eggs": {"canonical": "Whole Eggs", "allergens": ["eggs"], "dietary": ["vegan"], "is_derivative": False},
    "albumin": {"canonical": "Egg Albumin", "allergens": ["eggs"], "dietary": ["vegan"], "is_derivative": True},
    "egg yolk": {"canonical": "Egg Yolk", "allergens": ["eggs"], "dietary": ["vegan"], "is_derivative": True},

    # Sesame (FASTER Act)
    "sesame": {"canonical": "Sesame Seeds", "allergens": ["sesame"], "dietary": [], "is_derivative": False},
    "sesame oil": {"canonical": "Sesame Seed Oil", "allergens": ["sesame"], "dietary": [], "is_derivative": True},
    "tahini": {"canonical": "Tahini (Sesame Paste)", "allergens": ["sesame"], "dietary": [], "is_derivative": True},

    # Fish & Crustacean Shellfish
    "fish": {"canonical": "Fish", "allergens": ["fish"], "dietary": ["vegan", "vegetarian"], "is_derivative": False},
    "gelatin": {"canonical": "Gelatin (Animal Collagen)", "allergens": [], "dietary": ["vegan", "vegetarian", "halal"], "is_derivative": True},
    "carmine": {"canonical": "Carmine / Cochineal Extract (E120)", "allergens": [], "dietary": ["vegan", "vegetarian", "halal"], "e_number": "E120", "is_derivative": True},
    "e120": {"canonical": "Carmine (E120)", "allergens": [], "dietary": ["vegan", "vegetarian", "halal"], "e_number": "E120", "is_derivative": True},

    # Common Safe Ingredients
    "water": {"canonical": "Purified Water", "allergens": [], "dietary": [], "is_derivative": False},
    "sugar": {"canonical": "Cane Sugar", "allergens": [], "dietary": [], "is_derivative": False},
    "salt": {"canonical": "Sodium Chloride (Salt)", "allergens": [], "dietary": [], "is_derivative": False},
    "cocoa butter": {"canonical": "Cocoa Butter", "allergens": [], "dietary": [], "is_derivative": False},
    "cocoa mass": {"canonical": "Cocoa Mass", "allergens": [], "dietary": [], "is_derivative": False},
    "citric acid": {"canonical": "Citric Acid (E330)", "allergens": [], "dietary": [], "e_number": "E330", "is_derivative": False},
    "vanilla extract": {"canonical": "Vanilla Extract", "allergens": [], "dietary": [], "is_derivative": False},

    # Indian Food Items & Dairy / Flour / Spice Derivatives
    "paneer": {"canonical": "Paneer (Cottage Cheese)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": False},
    "desi ghee": {"canonical": "Clarified Butter (Desi Ghee)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "khoya": {"canonical": "Khoya / Mawa (Dried Milk Solids)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "mawa": {"canonical": "Khoya / Mawa (Dried Milk Solids)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "dahi": {"canonical": "Indian Curd (Dahi)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": False},
    "malai": {"canonical": "Clotted Cream (Malai)", "allergens": ["milk"], "dietary": ["vegan"], "is_derivative": True},
    "atta": {"canonical": "Whole Wheat Flour (Atta)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": False},
    "maida": {"canonical": "Refined Wheat Flour (Maida)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": False},
    "suji": {"canonical": "Semolina (Suji / Rava)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},
    "rava": {"canonical": "Semolina (Suji / Rava)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},
    "besan": {"canonical": "Gram Flour (Besan)", "allergens": [], "dietary": [], "is_derivative": False},
    "poha": {"canonical": "Flattened Rice (Poha)", "allergens": [], "dietary": [], "is_derivative": False},
    "sabudana": {"canonical": "Tapioca Sago (Sabudana)", "allergens": [], "dietary": [], "is_derivative": False},
    "hing": {"canonical": "Compounded Asafoetida (Hing)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},
    "asafoetida": {"canonical": "Compounded Asafoetida (Hing)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},
    "bandhani hing": {"canonical": "Compounded Asafoetida (Hing)", "allergens": ["wheat"], "dietary": ["gluten-free"], "is_derivative": True},
    "sarson": {"canonical": "Mustard Seeds (Sarson/Rai)", "allergens": [], "dietary": [], "is_derivative": False},
    "rai": {"canonical": "Mustard Seeds (Sarson/Rai)", "allergens": [], "dietary": [], "is_derivative": False},
    "mustard oil": {"canonical": "Mustard Oil (Kachi Ghani)", "allergens": [], "dietary": [], "is_derivative": True},
    "haldi": {"canonical": "Turmeric (Haldi / Curcumin)", "allergens": [], "dietary": [], "is_derivative": False},
    "turmeric": {"canonical": "Turmeric (Haldi / Curcumin)", "allergens": [], "dietary": [], "is_derivative": False},
    "jeera": {"canonical": "Cumin Seeds (Jeera)", "allergens": [], "dietary": [], "is_derivative": False},
    "dhaniya": {"canonical": "Coriander (Dhaniya)", "allergens": [], "dietary": [], "is_derivative": False},
    "methi": {"canonical": "Fenugreek (Methi / Kasuri Methi)", "allergens": [], "dietary": [], "is_derivative": False},
    "ajwain": {"canonical": "Carom Seeds (Ajwain)", "allergens": [], "dietary": [], "is_derivative": False},
    "garam masala": {"canonical": "Garam Masala Spice Blend", "allergens": [], "dietary": [], "is_derivative": False},
    "kaju": {"canonical": "Cashew Nuts (Kaju)", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "badam": {"canonical": "Almonds (Badam)", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "pista": {"canonical": "Pistachios (Pista)", "allergens": ["tree_nuts"], "dietary": [], "is_derivative": False},
    "til": {"canonical": "Sesame Seeds (Til)", "allergens": ["sesame"], "dietary": [], "is_derivative": False},
    "gur": {"canonical": "Jaggery (Gur)", "allergens": [], "dietary": [], "is_derivative": False},
    "jaggery": {"canonical": "Jaggery (Gur)", "allergens": [], "dietary": [], "is_derivative": False},
    "ragi": {"canonical": "Finger Millet (Ragi / Nachni)", "allergens": [], "dietary": [], "is_derivative": False},
    "nachni": {"canonical": "Finger Millet (Ragi / Nachni)", "allergens": [], "dietary": [], "is_derivative": False},
    "bajra": {"canonical": "Pearl Millet (Bajra)", "allergens": [], "dietary": [], "is_derivative": False},
    "jowar": {"canonical": "Sorghum (Jowar)", "allergens": [], "dietary": [], "is_derivative": False},
    "kuttu": {"canonical": "Buckwheat Flour (Kuttu Ka Atta)", "allergens": [], "dietary": [], "is_derivative": False},
    "rajgira": {"canonical": "Amaranth Flour (Rajgira)", "allergens": [], "dietary": [], "is_derivative": False},
    "chana dal": {"canonical": "Split Bengal Gram (Chana Dal)", "allergens": [], "dietary": [], "is_derivative": False},
    "toor dal": {"canonical": "Split Pigeon Peas (Toor / Arhar Dal)", "allergens": [], "dietary": [], "is_derivative": False},
    "arhar dal": {"canonical": "Split Pigeon Peas (Toor / Arhar Dal)", "allergens": [], "dietary": [], "is_derivative": False},
    "moong dal": {"canonical": "Split Green Gram (Moong Dal)", "allergens": [], "dietary": [], "is_derivative": False},
    "urad dal": {"canonical": "Split Black Gram (Urad Dal)", "allergens": [], "dietary": [], "is_derivative": False},
    "vanaspati": {"canonical": "Hydrogenated Vegetable Fat (Vanaspati / Dalda)", "allergens": [], "dietary": [], "is_derivative": True},
    "vark": {"canonical": "Edible Silver Leaf (Chandi Ka Vark)", "allergens": [], "dietary": [], "is_derivative": False},
    "hydrolysed groundnut protein": {"canonical": "Hydrolysed Groundnut Protein (Peanut Extract)", "allergens": ["peanuts"], "dietary": [], "is_derivative": True},
    "amchur": {"canonical": "Dry Mango Powder (Amchur)", "allergens": [], "dietary": [], "is_derivative": False},
    "kala namak": {"canonical": "Indian Black Salt (Kala Namak)", "allergens": [], "dietary": [], "is_derivative": False},
    "kesar": {"canonical": "Saffron (Kesar)", "allergens": [], "dietary": [], "is_derivative": False},
}


class IngredientParser:
    """
    NLP Tokenizer and Entity Normalizer for Food Product Labels.
    Extracts structured tokens, nested parenthetical sub-ingredients,
    and identifies precautionary allergen declarations.
    """

    @staticmethod
    def parse_raw_text(text: str) -> Tuple[List[NormalizedIngredient], List[str], List[str]]:
        if not text or not text.strip():
            return [], [], []

        # 1. Extract Precautionary Statements (e.g. "May contain: ...")
        precautionary_statements = []
        precaution_patterns = [
            r'(?:may contain|made on shared equipment with|manufactured in a facility that processes)[\s:]*([^\.\n]+)',
            r'(?:contains traces of)[\s:]*([^\.\n]+)'
        ]
        
        working_text = text
        for pat in precaution_patterns:
            matches = re.findall(pat, working_text, re.IGNORECASE)
            for m in matches:
                precautionary_statements.append(f"May contain: {m.strip()}")
            working_text = re.sub(pat, '', working_text, flags=re.IGNORECASE)

        # 2. Tokenize by commas, semicolons, bullets, and newlines (while handling parentheticals)
        raw_tokens = IngredientParser.split_ingredients(working_text)
        
        normalized: List[NormalizedIngredient] = []
        unresolved: List[str] = []

        for token in raw_tokens:
            cleaned = token.strip().strip('.').strip(':')
            if not cleaned or len(cleaned) < 2:
                continue
            
            # Lowercase lookup key
            lookup_key = cleaned.lower()
            
            # Match directly or fuzzy match
            matched_key = IngredientParser.match_canonical(lookup_key)
            
            if matched_key:
                info = CANONICAL_TAXONOMY[matched_key]
                normalized.append(NormalizedIngredient(
                    raw_token=cleaned,
                    canonical_name=info["canonical"],
                    confidence=0.98 if matched_key == lookup_key else 0.88,
                    allergens=info.get("allergens", []),
                    dietary_conflicts=info.get("dietary", []),
                    e_number=info.get("e_number"),
                    is_derivative=info.get("is_derivative", False),
                    is_unknown=False
                ))
            else:
                # Quarantined Unknown Ingredient
                normalized.append(NormalizedIngredient(
                    raw_token=cleaned,
                    canonical_name=f"Unresolved: {cleaned}",
                    confidence=0.30,
                    allergens=[],
                    dietary_conflicts=[],
                    is_unknown=True,
                    notes="Unrecognized chemical token or proprietary ingredient quarantined for consumer safety."
                ))
                unresolved.append(cleaned)

        return normalized, unresolved, precautionary_statements

    @staticmethod
    def split_ingredients(text: str) -> List[str]:
        """
        Splits ingredient text while respecting nested parentheses:
        e.g., 'Chocolate (sugar, cocoa butter, milk solids), Salt, Vanilla'
        """
        # Remove leading "Ingredients:" header
        text = re.sub(r'^(?:ingredients|contains)[\s:]*', '', text, flags=re.IGNORECASE)
        
        tokens = []
        current = []
        depth = 0

        for char in text:
            if char == '(':
                depth += 1
                current.append(char)
            elif char == ')':
                depth = max(0, depth - 1)
                current.append(char)
            elif char in [',', ';', '•', '\n'] and depth == 0:
                token = "".join(current).strip()
                if token:
                    tokens.append(token)
                current = []
            else:
                current.append(char)
        
        last_token = "".join(current).strip()
        if last_token:
            tokens.append(last_token)

        return tokens

    @staticmethod
    def match_canonical(token: str) -> str:
        if token in CANONICAL_TAXONOMY:
            return token
        
        # Check substring match
        for key in CANONICAL_TAXONOMY.keys():
            if key in token or token in key:
                return key
        return ""

ingredient_parser = IngredientParser()
