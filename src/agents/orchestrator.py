from src.agents.state import LearningPathState
from src.graph.concept_map import ConceptMapManager
from src.vector_db.retriever import ResourceRetriever

class AdaptiveLearningOrchestrator:
    """
    Coordinates multi-agent decision loop:
    1. Profile/Diagnostic: Evaluates prerequisite graph for gaps.
    2. Path Decision: Shifts focus to remediation if prerequisite mastery is low.
    3. Recommender: Matches materials by student theta and format preference.
    """

    def __init__(self):
        self.graph_manager = ConceptMapManager()
        self.retriever = ResourceRetriever()

    def generate_recommendation_path(self, state: LearningPathState) -> LearningPathState:
        # Step 1: Diagnostic Check for Upstream Skill Gaps
        root_gaps = self.graph_manager.find_root_cause_gaps(
            target_concept=state.requested_concept,
            student_mastery=state.mastery_map,
            mastery_threshold=0.7
        )

        state.identified_gaps = root_gaps

        # Step 2: Dynamic Pathing Strategy
        if root_gaps:
            # Shift focus to the earliest unmastered prerequisite
            state.active_target_concept = root_gaps[0]
            state.is_remediation = True
            state.decision_reasoning = (
                f"Prerequisite gap detected in '{root_gaps[0]}'. "
                f"Pausing '{state.requested_concept}' to build foundational mastery."
            )
        else:
            state.active_target_concept = state.requested_concept
            state.is_remediation = False
            state.decision_reasoning = (
                f"Prerequisites satisfied. Delivering path for target topic '{state.requested_concept}'."
            )

        # Step 3: Content Recommendation Engine
        resources = self.retriever.get_matched_resources(
            concept_id=state.active_target_concept,
            student_theta=state.current_theta,
            preferred_format=state.preferred_format,
            top_k=3
        )
        state.recommended_resources = resources

        return state