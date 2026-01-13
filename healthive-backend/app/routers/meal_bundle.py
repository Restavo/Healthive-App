from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.user_profile import UserProfile
from app.services.meal_bundle import (
    generate_meal_bundle,
    apply_meal_bundle
)

router = APIRouter(prefix="/meal-bundle", tags=["Meal Bundle"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/preview")
def preview_bundle(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter_by(user_id=user_id).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )

    return generate_meal_bundle(
        db=db,
        user_id=user_id,
        daily_target=profile.daily_target
    )


@router.post("/apply")
def apply_bundle(
    payload: dict,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if "bundle" not in payload:
        raise HTTPException(
            status_code=400,
            detail="Invalid bundle payload"
        )

    apply_meal_bundle(
        db=db,
        user_id=user_id,
        bundle=payload["bundle"]
    )

    return {"message": "Meal bundle applied successfully"}
