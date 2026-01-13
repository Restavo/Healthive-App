from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user_food_log import UserFoodLog
from app.models.user_profile import UserProfile


# =========================
# DAILY DASHBOARD
# =========================
def get_daily_dashboard(db: Session, user_id: int):
    today = date.today()

    logs = db.query(UserFoodLog).filter(
        UserFoodLog.user_id == user_id,
        UserFoodLog.log_date == today
    ).all()

    consumed = sum(log.calories for log in logs)

    profile = db.query(UserProfile).filter_by(user_id=user_id).first()

    return {
        "date": today,
        "daily_target": profile.daily_target,
        "consumed": round(consumed),
        "remaining": round(profile.daily_target - consumed),
        "macros": {
            "protein": round(sum(log.protein for log in logs)),
            "carbs": round(sum(log.carbs for log in logs)),
            "fat": round(sum(log.fat for log in logs))
        }
    }


# =========================
# WEEKLY DASHBOARD
# =========================
def get_weekly_dashboard(db: Session, user_id: int):
    today = date.today()
    start = today - timedelta(days=6)

    rows = db.query(
        UserFoodLog.log_date,
        func.sum(UserFoodLog.calories).label("calories")
    ).filter(
        UserFoodLog.user_id == user_id,
        UserFoodLog.log_date >= start
    ).group_by(
        UserFoodLog.log_date
    ).order_by(
        UserFoodLog.log_date
    ).all()

    return [{
        "date": r.log_date,
        "calories": round(r.calories)
    } for r in rows]


# =========================
# MONTHLY DASHBOARD
# =========================
def get_monthly_dashboard(db: Session, user_id: int):
    today = date.today()
    start = today.replace(day=1)

    rows = db.query(
        UserFoodLog.log_date,
        func.sum(UserFoodLog.calories).label("calories")
    ).filter(
        UserFoodLog.user_id == user_id,
        UserFoodLog.log_date >= start
    ).group_by(
        UserFoodLog.log_date
    ).order_by(
        UserFoodLog.log_date
    ).all()

    return [{
        "date": r.log_date,
        "calories": round(r.calories)
    } for r in rows]
