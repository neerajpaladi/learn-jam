from typing import List, Dict, Set

# Initial Knowledge Graph Schema (Directed Acyclic Graph)
CONCEPT_GRAPH: Dict[str, Dict] = {
    "python_basics": {
        "title": "Python Syntax & Variables",
        "prerequisites": []
    },
    "control_flow": {
        "title": "Conditionals & Loops",
        "prerequisites": ["python_basics"]
    },
    "data_structures": {
        "title": "Lists, Dicts & Sets",
        "prerequisites": ["python_basics"]
    },
    "functions": {
        "title": "Functions & Scope",
        "prerequisites": ["control_flow"]
    },
    "recursion": {
        "title": "Recursion",
        "prerequisites": ["functions"]
    },
    "oop_concepts": {
        "title": "Object-Oriented Programming",
        "prerequisites": ["functions", "data_structures"]
    }
}

class ConceptMapManager:
    def __init__(self, graph: Dict[str, Dict] = CONCEPT_GRAPH):
        self.graph = graph

    def get_direct_prerequisites(self, concept_id: str) -> List[str]:
        """Returns direct dependency nodes for a given concept."""
        concept = self.graph.get(concept_id)
        return concept.get("prerequisites", []) if concept else []

    def get_all_ancestor_prerequisites(self, concept_id: str) -> List[str]:
        """Recursively traverses the DAG to find all upstream prerequisite nodes."""
        visited: Set[str] = set()

        def dfs(curr_id: str):
            for prereq in self.get_direct_prerequisites(curr_id):
                if prereq not in visited:
                    visited.add(prereq)
                    dfs(prereq)

        dfs(concept_id)
        return list(visited)

    def find_root_cause_gaps(
        self, 
        target_concept: str, 
        student_mastery: Dict[str, float], 
        mastery_threshold: float = 0.7
    ) -> List[str]:
        """
        Identifies upstream concept gaps where the student's 
        mastery score is below the required threshold (default 0.7).
        """
        all_prereqs = self.get_all_ancestor_prerequisites(target_concept)
        
        # Filter for prerequisite concepts that haven't met mastery threshold
        unmastered_gaps = [
            concept for concept in all_prereqs
            if student_mastery.get(concept, 0.0) < mastery_threshold
        ]
        
        return unmastered_gaps