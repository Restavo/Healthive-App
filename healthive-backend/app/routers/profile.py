from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.user_profile import UserProfile
from app.schemas.profile import ProfileInput, ProfileResponse
from app.services.health import calculate_macro_targets

router = APIRouter(prefix="/profile", tags=["Profile"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# GET PROFILE (INI YANG KURANG)
# =========================
@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter_by(user_id=user_id).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not created"
        )

    return profile


# =========================
# CREATE / UPDATE PROFILE
# =========================
@router.post("/me", response_model=ProfileResponse)
def create_or_update_profile(
    data: ProfileInput,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = calculate_macro_targets(
        weight=data.weight,
        height=data.height,
        age=data.age,
        gender=data.gender,
        activity_level=data.activity_level,
        goal=data.goal,
        target_weight=data.target_weight,
        duration_months=data.duration_months
    )

    profile = db.query(UserProfile).filter_by(user_id=user_id).first()

    if not profile:
        profile = UserProfile(user_id=user_id)

    profile.name = data.name
    profile.weight = data.weight
    profile.height = data.height
    profile.age = data.age
    profile.gender = data.gender
    profile.activity_level = data.activity_level
    profile.goal = data.goal
    profile.target_weight = data.target_weight
    profile.duration_months = data.duration_months
    profile.bmi = result["bmi"]
    profile.daily_target = result["daily_target_calories"]

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile
