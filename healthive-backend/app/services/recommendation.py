from datetime import date
from sqlalchemy.orm import Session

from app.models.food import Food
from app.models.user_food_log import UserFoodLog


# ==================================
# REAL-TIME FOOD RECOMMENDATION
# ==================================
def get_realtime_food_recommendations(
    db: Session,
    user_id: int,
    daily_target: int,
    limit: int = 5
):
    """
    Rekomendasi makanan real-time berdasarkan sisa kalori hari ini
    """

    logs = db.query(UserFoodLog).filter(
        UserFoodLog.user_id == user_id,
        UserFoodLog.log_date == date.today()
    ).all()

    consumed = sum(log.calories for log in logs)
    remaining = max(daily_target - consumed, 0)

    if remaining == 0:
        return []

    foods = (
        db.query(Food)
        .filter((Food.calories_per_gram * 100) <= remaining)
        .order_by(Food.calories_per_gram.asc())
        .limit(limit)
        .all()
    )

    return foods
