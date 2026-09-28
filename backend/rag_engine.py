import os
from typing import List, Dict, Any, Tuple, Optional
try:
    import chromadb
except ImportError:
    chromadb = None

try:
    from google import genai
except ImportError:
    genai = None

from config import settings
from models import RegulatoryCitation, NormalizedIngredient, ConflictItem, UserProfileSchema

# Curated Regulatory Corpus Excerpts (FDA 21 CFR & EFSA)
REGULATORY_DOCS = [
    {
        "id": "fda-21cfr-101-milk",
        "source": "FDA_21CFR",
        "title": "21 CFR 101.4 & FALCPA: Milk & Dairy Derivative Declarations",
        "excerpt": "Under the Food Allergen Labeling and Consumer Protection Act (FALCPA), food products containing milk or major milk proteins including casein, whey, and lactoglobulin must explicitly declare milk source on the label.",
        "keywords": ["milk", "dairy", "casein", "whey", "lactose", "butter", "cream", "cheese"],
        "url": "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/cfrsearch.cfm?fr=101.4"
    },
    {
        "id": "fda-faster-act-sesame",
        "source": "FASTER_ACT",
        "title": "FDA FASTER Act: Mandatory Sesame Allergen Labeling",
        "excerpt": "Effective January 1, 2023, sesame is designated as the 9th major food allergen under the Food Allergy Safety, Treatment, Education, and Research (FASTER) Act. All packaged foods must explicitly declare sesame seeds, tahini, and sesame oils.",
        "keywords": ["sesame", "tahini", "sesame oil", "sesame seeds"],
        "url": "https://www.fda.gov/food/food-labeling-nutrition/food-allergies"
    },
    {
        "id": "fda-21cfr-peanuts",
        "source": "FDA_21CFR",
        "title": "21 CFR 101.4: Peanut and Tree Nut Labeling Requirements",
        "excerpt": "Ingredients derived from peanuts or tree nuts (almonds, walnuts, cashews, hazelnuts) must clearly state the specific nut species to prevent severe anaphylaxis in sensitive populations.",
        "keywords": ["peanut", "peanuts", "tree_nuts", "almond", "walnut", "cashew", "hazelnut", "pistachio"],
        "url": "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/cfrsearch.cfm?fr=101.4"
    },
    {
        "id": "efsa-e120-carmine",
        "source": "EFSA",
        "title": "EFSA Scientific Opinion on Cochineal, Carminic Acid, Carmines (E 120)",
        "excerpt": "EFSA confirms that carmines (E 120) are derived from female insects of Dactylopius coccus Costa. This food colorant is unsuitable for strict vegan or vegetarian diets and poses potential hypersensitivity risks.",
        "keywords": ["carmine", "e120", "cochineal", "vegan", "vegetarian", "halal"],
        "url": "https://www.efsa.europa.eu/en/efsajournal/pub/4288"
    },
    {
        "id": "efsa-e322-lecithin",
        "source": "EFSA",
        "title": "EFSA Re-evaluation of Lecithins (E 322) as Food Additives",
        "excerpt": "Lecithins (E 322) derived from soybean or egg sources must declare the allergen origin on packaged goods in accordance with EU Regulation No 1169/2011.",
        "keywords": ["lecithin", "soy lecithin", "e322", "soybeans", "eggs"],
        "url": "https://www.efsa.europa.eu/en/efsajournal/pub/6266"
    },
    {
        "id": "fssai-labelling-2020-allergens",
        "source": "FSSAI",
        "title": "FSSAI Food Safety and Standards (Labelling and Display) Regulations 2020: Mandatory Allergens",
        "excerpt": "Under Clause 5(3), food business operators in India must declare: Cereals with gluten (wheat, rye, barley, oats), Crustaceans, Milk & milk products, Eggs, Fish, Peanuts & Tree nuts, Soybeans, and Sulphite >= 10mg/kg.",
        "keywords": ["fssai", "india", "wheat", "milk", "paneer", "ghee", "peanut", "soy", "egg", "fish", "sulphite"],
        "url": "https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf"
    },
    {
        "id": "fssai-veg-nonveg-symbols",
        "source": "FSSAI",
        "title": "FSSAI Mandatory Green & Brown Dot Dietary Symbols",
        "excerpt": "Mandates Green Dot in green square for 100% vegetarian food and Brown Triangle in brown square for non-vegetarian food containing animal body parts or non-dairy animal derivatives like gelatin, carmine, or animal rennet.",
        "keywords": ["fssai", "green dot", "brown dot", "vegetarian", "non-vegetarian", "gelatin", "carmine"],
        "url": "https://www.fssai.gov.in/upload/advisories/2021/10/6169527f3aa41Letter_Veg_Non_Veg_Logo.pdf"
    },
    {
        "id": "fssai-dairy-paneer-ghee",
        "source": "FSSAI",
        "title": "FSSAI Dairy Standards: Paneer, Desi Ghee, Khoya and Curd",
        "excerpt": "Defines standards for indigenous Indian dairy products. Paneer, Khoya (mawa), Malai, and Dahi contain high concentrations of cow/buffalo casein and whey proteins, presenting critical risk to milk-allergic consumers.",
        "keywords": ["paneer", "ghee", "desi ghee", "khoya", "mawa", "malai", "dahi", "curd", "milk"],
        "url": "https://www.fssai.gov.in/upload/uploadfiles/files/Milk_and_Milk_Products_Regulations.pdf"
    },
    {
        "id": "fssai-spices-hing-mustard",
        "source": "FSSAI",
        "title": "FSSAI Compounded Hing (Asafoetida) & Mustard Quality Standards",
        "excerpt": "Compounded Asafoetida (Bandhani Hing) is blended with edible Maida (wheat flour) or wheat starch carrier, posing hidden gluten risks for Celiac and wheat-allergic consumers. Mustard (Sarson/Rai) and mustard oil require distinct allergen precaution.",
        "keywords": ["hing", "asafoetida", "bandhani hing", "maida", "wheat", "gluten", "mustard", "sarson", "rai"],
        "url": "https://www.fssai.gov.in/upload/uploadfiles/files/Spices_Condiments_Standards.pdf"
    }
]


class RegulatoryRAGEngine:
    """
    RAG & Vector Search Engine:
    Maintains ChromaDB vector collection of FDA / EFSA regulatory documents
    and generates grounded Gemini API explanations.
    """

    def __init__(self):
        # Initialize ChromaDB Vector Store
        self.collection = None
        if chromadb:
            try:
                self.chroma_client = chromadb.Client()
                self.collection = self.chroma_client.get_or_create_collection(
                    name=settings.COLLECTION_NAME,
                    metadata={"description": "FDA & EFSA Regulatory Knowledge Base"}
                )
                self._seed_regulatory_corpus()
            except Exception as e:
                print(f"Warning: ChromaDB initialization in-memory: {e}")

        # Initialize Gemini Client
        self.ai_client = None
        if genai and settings.GEMINI_API_KEY:
            try:
                self.ai_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                print(f"Gemini client initialization notice: {e}")

    def _seed_regulatory_corpus(self):
        """Indexes regulatory documents into ChromaDB collection."""
        if not self.collection:
            return
        
        # Check if already seeded
        if self.collection.count() > 0:
            return

        documents = [doc["excerpt"] for doc in REGULATORY_DOCS]
        metadatas = [{"source": doc["source"], "title": doc["title"], "url": doc["url"]} for doc in REGULATORY_DOCS]
        ids = [doc["id"] for doc in REGULATORY_DOCS]

        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def retrieve_relevant_citations(self, normalized_ingredients: List[NormalizedIngredient]) -> List[RegulatoryCitation]:
        """
        Retrieves matching regulatory documents using Vector / Semantic Search.
        """
        query_terms = set()
        for item in normalized_ingredients:
            query_terms.add(item.raw_token.lower())
            for a in item.allergens:
                query_terms.add(a.lower())
            if item.e_number:
                query_terms.add(item.e_number.lower())

        matched_citations: List[RegulatoryCitation] = []

        # 1. Vector Search Query via ChromaDB
        if self.collection and len(query_terms) > 0:
            try:
                query_text = " ".join(query_terms)
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=min(3, len(REGULATORY_DOCS))
                )
                if results and "documents" in results and len(results["documents"][0]) > 0:
                    for doc_text, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0] if "distances" in results else [0.2]*len(results["documents"][0])):
                        score = max(0.60, min(0.99, round(1.0 - (dist if isinstance(dist, float) else 0.2), 2)))
                        matched_citations.append(RegulatoryCitation(
                            source=meta.get("source", "FDA"),
                            title=meta.get("title", "Regulatory Reference"),
                            excerpt=doc_text,
                            url=meta.get("url", "https://www.fda.gov"),
                            relevance_score=score
                        ))
                    return matched_citations
            except Exception as e:
                print(f"Vector search fallback to keyword matching: {e}")

        # 2. Heuristic Keyword Retrieval Fallback
        for doc in REGULATORY_DOCS:
            if any(k in query_terms or any(k in t for t in query_terms) for k in doc["keywords"]):
                matched_citations.append(RegulatoryCitation(
                    source=doc["source"],
                    title=doc["title"],
                    excerpt=doc["excerpt"],
                    url=doc["url"],
                    relevance_score=0.94
                ))

        return matched_citations[:3]

    def generate_grounded_explanation(
        self,
        risk_level: str,
        conflicts: List[ConflictItem],
        citations: List[RegulatoryCitation],
        user_profile: Optional[UserProfileSchema]
    ) -> str:
        """
        Generates a concise consumer-friendly explanation grounded strictly
        in the retrieved regulatory citations.
        """
        if self.ai_client:
            try:
                prompt = f"""
                You are SafeScan AI's regulatory explanation assistant.
                Explain this food safety verdict to a consumer:
                - Verdict: {risk_level}
                - Conflicts Detected: {[c.description for c in conflicts]}
                - User Declared Allergies: {user_profile.allergies if user_profile else []}
                - User Diet: {user_profile.dietType if user_profile else 'none'}
                - Grounding Regulatory Citations: {[c.title + ': ' + c.excerpt for c in citations]}
                
                Rules:
                1. You must NEVER override or alter the provided Verdict ({risk_level}).
                2. Be objective, concise (under 3 sentences), and cite the relevant FDA / EFSA regulations.
                """
                response = self.ai_client.models.generate_content(
                    model=settings.LLM_MODEL,
                    contents=prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"Gemini API explanation fallback: {e}")

        # Fallback deterministic summary
        if risk_level == "NOT_SUITABLE":
            conflict_names = ", ".join([c.ingredient for c in conflicts if c.type in ['ALLERGEN', 'DIETARY']])
            return f"Product is not suitable due to conflict with {conflict_names}. This evaluation is grounded in FDA 21 CFR allergen labeling mandates."
        elif risk_level == "CAUTION":
            return "Caution is advised. The product formulation contains unmapped or precautionary compounds under SafeScan quarantine protocols."
        else:
            return "No conflicts detected against your active allergen declarations and dietary preferences. Product is safe to consume."

rag_engine = RegulatoryRAGEngine()
