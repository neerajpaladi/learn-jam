from pydantic import BaseModel
from typing import List, Dict, Optional

class StudentProfileCreate(BaseModel):
    target_goals: List[str] = []
    preferred_format: str = "mixed"
    learning_pace: str = "medium"

class StudentProfileOut(BaseModel):
    id: str
    user_id: str
    target_goals: List[str]
    preferred_format: str
    learning_pace: str
    ability_score: float
    mastery_map: Dict[str, float]
    current_streak: int
    longest_streak: int
    last_active_date: Optional[str]