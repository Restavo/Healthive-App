from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.services.dashboard import (
    get_daily_dashboard,
    get_weekly_dashboard,
    get_monthly_dashboard
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/daily")
def daily_dashboard(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_daily_dashboard(db, user_id)


@router.get("/weekly")
def weekly_dashboard(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_weekly_dashboard(db, user_id)


@router.get("/monthly")
def monthly_dashboard(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_monthly_dashboard(db, user_id)
