from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionItem(BaseModel):
    id: str
    concept_id: str
    question_text: str
    options: List[str]
    correct_option_index: int
    difficulty: float = Field(default=0.0, ge=-3.0, le=3.0)  # IRT b parameter
    discrimination: float = Field(default=1.0, ge=0.1, le=2.5) # IRT a parameter

class AnswerSubmission(BaseModel):
    question_id: str
    concept_id: str
    selected_option_index: int
    difficulty: float
    discrimination: float = 1.0

class AssessmentResult(BaseModel):
    is_correct: bool
    correct_option_index: int
    previous_theta: float
    new_theta: float
    previous_mastery: float
    new_mastery: float
    concept_id: str