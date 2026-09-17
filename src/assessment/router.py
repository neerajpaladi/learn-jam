from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.db.base import get_session
from src.db.models import UserTable, StudentProfileTable
from src.models.assessment import AnswerSubmission, AssessmentResult
from src.assessment.irt_engine import IRTEngine
from src.agents.orchestrator import AdaptiveLearningOrchestrator
from src.agents.state import LearningPathState
from src.auth.deps import get_current_user

router = APIRouter(prefix="/learning", tags=["Learning Engine"])
orchestrator = AdaptiveLearningOrchestrator()

@router.post("/submit-answer", response_model=AssessmentResult)
def submit_answer(
    submission: AnswerSubmission,
    current_user: UserTable = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(StudentProfileTable).where(StudentProfileTable.user_id == current_user.id)
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    is_correct = submission.selected_option_index == submission.correct_option_index

    # Update IRT Theta & Concept Mastery
    prev_theta = profile.ability_score
    new_theta = IRTEngine.update_theta(
        current_theta=prev_theta,
        difficulty=submission.difficulty,
        is_correct=is_correct,
        discrimination=submission.discrimination
    )

    mastery_map = dict(profile.mastery_map or {})
    prev_mastery = mastery_map.get(submission.concept_id, 0.0)
    new_mastery = IRTEngine.update_concept_mastery(
        current_mastery=prev_mastery,
        is_correct=is_correct,
        item_difficulty=submission.difficulty
    )

    # Persist updates in database
    mastery_map[submission.concept_id] = new_mastery
    profile.ability_score = new_theta
    profile.mastery_map = mastery_map

    session.add(profile)
    session.commit()

    return AssessmentResult(
        is_correct=is_correct,
        correct_option_index=submission.correct_option_index,
        previous_theta=prev_theta,
        new_theta=new_theta,
        previous_mastery=prev_mastery,
        new_mastery=new_mastery,
        concept_id=submission.concept_id
    )

@router.get("/recommend/{concept_id}")
def get_adaptive_path(
    concept_id: str,
    current_user: UserTable = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(StudentProfileTable).where(StudentProfileTable.user_id == current_user.id)
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Pass profile to multi-agent decision loop
    state = LearningPathState(
        user_id=current_user.id,
        requested_concept=concept_id,
        current_theta=profile.ability_score,
        preferred_format=profile.preferred_format,
        mastery_map=profile.mastery_map or {}
    )

    return orchestrator.generate_recommendation_path(state)