from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.db.base import get_session
from src.db.models import UserTable, StudentProfileTable
from src.models.student import StudentProfileCreate, StudentProfileOut
from src.auth.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/me", response_model=StudentProfileOut)
def get_profile(
    current_user: UserTable = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(StudentProfileTable).where(StudentProfileTable.user_id == current_user.id)
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=StudentProfileOut)
def update_profile(
    profile_data: StudentProfileCreate,
    current_user: UserTable = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    profile = session.exec(
        select(StudentProfileTable).where(StudentProfileTable.user_id == current_user.id)
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.target_goals = profile_data.target_goals
    profile.preferred_format = profile_data.preferred_format
    profile.learning_pace = profile_data.learning_pace
    
    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile