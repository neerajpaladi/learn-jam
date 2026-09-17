from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class StudentProfileCreate(BaseModel):
    target_goals: List[str] = Field(default_factory=list, example=["Python Syntax", "Data Structures"])
    preferred_format: str = Field(default="mixed", example="visual")  # visual, textual, interactive, mixed
    learning_pace: str = Field(default="medium", example="medium")    # slow, medium, fast

class SkillMasteryUpdate(BaseModel):
    concept_id: str
    score: float = Field(ge=0.0, le=1.0)  # Mastery between 0.0 and 1.0

class StudentProfileOut(BaseModel):
    id: str
    user_id: str
    target_goals: List[str]
    preferred_format: str
    learning_pace: str
    ability_score: float                  # IRT Theta (\theta) value
    mastery_map: Dict[str, float]         # Map of concept_id -> score (e.g. {"variables": 0.85})