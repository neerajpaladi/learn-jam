import uuid
from typing import List, Dict, Optional
from sqlmodel import SQLModel, Field, JSON

class UserTable(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)

class StudentProfileTable(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="usertable.id", unique=True, index=True)
    target_goals: List[str] = Field(default=[], sa_type=JSON)
    preferred_format: str = Field(default="mixed")
    learning_pace: str = Field(default="medium")
    ability_score: float = Field(default=0.0)
    mastery_map: Dict[str, float] = Field(default={}, sa_type=JSON)
    
    # Streak Tracking
    current_streak: int = Field(default=0)
    longest_streak: int = Field(default=0)
    last_active_date: Optional[str] = Field(default=None)