from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.user_profile import UserProfile
from app.services.recommendation import get_realtime_food_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/foods")
def recommend_foods(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    REAL-TIME FOOD RECOMMENDATION
    (AMAN, DIPAKAI FRONTEND)
    """

    profile = db.query(UserProfile).filter_by(user_id=user_id).first()
    if not profile:
        return []

    foods = get_realtime_food_recommendations(
        db=db,
        user_id=user_id,
        daily_target=profile.daily_target
    )

    return [
        {
            "food_id": f.id,
            "name": f.name,
            "category": f.category,
            "calories_100g": round(f.calories_per_gram * 100)
        }
        for f in foods
    ]
