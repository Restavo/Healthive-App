from pydantic import BaseModel

class AddMealRequest(BaseModel):
    food_id: int
    gram: float


class MealResponse(BaseModel):
    id: int
    food_id: int
    gram: float
    calories: float

    class Config:
        from_attributes = True
