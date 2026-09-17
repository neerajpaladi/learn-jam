from pydantic import BaseModel
from typing import List, Dict, Optional
from src.models.resource import LearningResource

class LearningPathState(BaseModel):
    user_id: str
    requested_concept: str
    current_theta: float
    preferred_format: str
    mastery_map: Dict[str, float]
    
    # Decisions populated by agents
    active_target_concept: str = ""
    is_remediation: bool = False
    identified_gaps: List[str] = []
    recommended_resources: List[LearningResource] = []
    decision_reasoning: str = ""