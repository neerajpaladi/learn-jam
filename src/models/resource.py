from pydantic import BaseModel, Field
from typing import List, Optional

class LearningResource(BaseModel):
    id: str
    title: str
    concept_id: str
    content_type: str  # visual, textual, interactive, video
    difficulty: float   # Difficulty parameter b (-3.0 to 3.0)
    url: str
    summary: str

class RecommendationRequest(BaseModel):
    concept_id: str
    student_theta: float
    preferred_format: str = "mixed"

class RecommendationResponse(BaseModel):
    concept_id: str
    target_difficulty: float
    recommended_resources: List[LearningResource]