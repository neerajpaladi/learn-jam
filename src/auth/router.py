from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from src.db.base import get_session
from src.db.models import UserTable, StudentProfileTable
from src.models.user import UserCreate, UserLogin, TokenResponse, UserOut
from src.auth.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(UserTable).where(UserTable.email == user_data.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 1. Register base User
    new_user = UserTable(
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # 2. Automatically create linked Student Profile
    profile = StudentProfileTable(user_id=new_user.id)
    session.add(profile)
    session.commit()
    
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(
        select(UserTable).where(UserTable.email == credentials.email)
    ).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    return TokenResponse(access_token=access_token)