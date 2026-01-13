from pydantic import BaseModel

class FoodListItem(BaseModel):
    id: int
    name: str
    category: str
    calories_per_gram: float

    class Config:
        from_attributes = True


class FoodDetail(BaseModel):
    id: int
    name: str
    category: str
    calories_per_gram: float
    protein_per_gram: float
    carbs_per_gram: float
    fat_per_gram: float

    class Config:
        from_attributes = True
