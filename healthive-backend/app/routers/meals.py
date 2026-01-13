from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.models.food import Food
from app.models.user_food_log import UserFoodLog
from app.schemas.meals import AddMealRequest, MealResponse

router = APIRouter(prefix="/meals", tags=["Meals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MealResponse)
def add_meal(
    data: AddMealRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    food = db.query(Food).filter(Food.id == data.food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    calories = data.gram * food.calories_per_gram
    protein = data.gram * food.protein_per_gram
    carbs = data.gram * food.carbs_per_gram
    fat = data.gram * food.fat_per_gram

    meal = UserFoodLog(
        user_id=user_id,
        food_id=food.id,
        gram=data.gram,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        log_date=date.today()
    )

    db.add(meal)
    db.commit()
    db.refresh(meal)

    return meal
