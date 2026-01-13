from pydantic import BaseModel

class ProfileInput(BaseModel):
    name: str
    weight: float
    height: float
    age: int
    gender: str
    activity_level: str

    goal: str                 # lose | maintain | gain
    target_weight: float
    duration_months: int


class ProfileResponse(BaseModel):
    name: str
    weight: float
    height: float
    age: int
    gender: str
    activity_level: str

    goal: str
    target_weight: float
    duration_months: int

    bmi: float
    daily_target: int

    class Config:
        from_attributes = True
