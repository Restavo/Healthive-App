from fastapi import FastAPI

from app.routers import auth, meals, foods, profile, dashboard
from app.routers import recommendation, meal_bundle

app = FastAPI(title="Healthive API")

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(foods.router)
app.include_router(meals.router)
app.include_router(dashboard.router)
app.include_router(recommendation.router)
app.include_router(meal_bundle.router)

