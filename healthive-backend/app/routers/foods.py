from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import SessionLocal
from app.models.food import Food
from app.schemas.food import FoodListItem, FoodDetail

router = APIRouter(prefix="/foods", tags=["Foods"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[FoodListItem])
def list_foods(
    search: Optional[str] = Query(None, description="Search by name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    query = db.query(Food)

    if search:
        query = query.filter(Food.name.ilike(f"%{search}%"))

    if category:
        query = query.filter(Food.category == category)

    return query.order_by(Food.name.asc()).limit(50).all()


@router.get("/{food_id}", response_model=FoodDetail)
def get_food_detail(food_id: int, db: Session = Depends(get_db)):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food
