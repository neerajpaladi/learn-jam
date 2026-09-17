from typing import List
from src.models.resource import LearningResource

# Sample In-Memory Learning Content Index
MOCK_RESOURCE_DB: List[LearningResource] = [
    LearningResource(
        id="res_01",
        title="Python Variables & Memory Models Explained Visually",
        concept_id="python_basics",
        content_type="visual",
        difficulty=-1.5,
        url="https://learn.example.com/python-vars-visual",
        summary="Infographic and flowcharts mapping out Python memory allocation."
    ),
    LearningResource(
        id="res_02",
        title="Interactive Python Syntax Playground",
        concept_id="python_basics",
        content_type="interactive",
        difficulty=-0.5,
        url="https://learn.example.com/python-basics-interactive",
        summary="Hands-on coding exercises with instant validation."
    ),
    LearningResource(
        id="res_03",
        title="Deep Dive: Scope & Function Stack Frames",
        concept_id="functions",
        content_type="textual",
        difficulty=0.5,
        url="https://learn.example.com/functions-scope-text",
        summary="Comprehensive text breakdown of function call stacks and variable lookup."
    ),
    LearningResource(
        id="res_04",
        title="Visualizing Call Stacks in Recursion",
        concept_id="recursion",
        content_type="visual",
        difficulty=1.2,
        url="https://learn.example.com/recursion-visualizer",
        summary="Animated diagrams showing frame creation and stack unwinding."
    ),
]

class ResourceRetriever:
    def __init__(self, database: List[LearningResource] = MOCK_RESOURCE_DB):
        self.db = database

    def get_matched_resources(
        self, 
        concept_id: str, 
        student_theta: float, 
        preferred_format: str = "mixed", 
        top_k: int = 3
    ) -> List[LearningResource]:
        """
        Retrieves resources matching concept_id, sorted by relevance to preferred 
        format and proximity to student's current theta difficulty level.
        """
        # 1. Filter by target concept
        matching_items = [item for item in self.db if item.concept_id == concept_id]
        if not matching_items:
            return []

        # 2. Score resources based on difficulty match and preferred learning style
        def rank_score(item: LearningResource) -> float:
            difficulty_diff = abs(item.difficulty - student_theta)
            
            # Format bonus boost
            format_match_bonus = 0.0
            if preferred_format != "mixed" and item.content_type == preferred_format:
                format_match_bonus = -0.5  # Lower distance rank
                
            return difficulty_diff + format_match_bonus

        # 3. Sort ascending (smallest distance = closest match)
        ranked = sorted(matching_items, key=rank_score)
        return ranked[:top_k]