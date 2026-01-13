from datetime import date
from sqlalchemy.orm import Session

from app.models.food import Food
from app.models.user_food_log import UserFoodLog

# Distribusi kalori per waktu makan
MEAL_SPLIT = {
    "breakfast": 0.30,
    "lunch": 0.40,
    "dinner": 0.30
}


def generate_meal_bundle(db: Session, user_id: int, daily_target: int):
    """
    Generate meal bundle real-time berdasarkan sisa kalori user hari ini
    """

    # Hitung kalori terpakai hari ini
    logs = db.query(UserFoodLog).filter(
        UserFoodLog.user_id == user_id,
        UserFoodLog.log_date == date.today()
    ).all()

    consumed = sum(log.calories for log in logs)
    remaining = max(daily_target - consumed, 0)

    if remaining == 0:
        return {
            "remaining_calories": 0,
            "bundle": {}
        }

    bundle = {}

    for meal, ratio in MEAL_SPLIT.items():
        meal_target = remaining * ratio

        foods = (
            db.query(Food)
            .filter((Food.calories_per_gram * 100) <= meal_target)
            .order_by(Food.calories_per_gram.desc())
            .limit(5)
            .all()
        )

        selected = []
        total_meal_cal = 0

        for food in foods:
            gram = min(150, meal_target / food.calories_per_gram)
            calories = food.calories_per_gram * gram

            selected.append({
                "food_id": food.id,
                "name": food.name,
                "gram": round(gram),
                "calories": round(calories)
            })

            total_meal_cal += calories
            if total_meal_cal >= meal_target * 0.9:
                break

        bundle[meal] = {
            "target_calories": round(meal_target),
            "total_calories": round(total_meal_cal),
            "foods": selected
        }

    return {
        "remaining_calories": round(remaining),
        "bundle": bundle
    }


def apply_meal_bundle(db: Session, user_id: int, bundle: dict):
    """
    Apply meal bundle ke user_food_logs
    (LOGIC SAMA PERSIS KAYAK INPUT MAKANAN MANUAL)
    """

    for meal in bundle.values():
        for item in meal["foods"]:
            food = db.query(Food).filter_by(id=item["food_id"]).first()

            calories = food.calories_per_gram * item["gram"]

            log = UserFoodLog(
                user_id=user_id,
                food_id=food.id,
                gram=item["gram"],
                calories=calories,
                protein=food.protein_per_gram * item["gram"],
                carbs=food.carbs_per_gram * item["gram"],
                fat=food.fat_per_gram * item["gram"],
                log_date=date.today()
            )
            db.add(log)

    db.commit()
