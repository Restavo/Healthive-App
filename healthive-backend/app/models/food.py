from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(20), nullable=False)

    calories_per_gram = Column(Float, nullable=False)
    protein_per_gram = Column(Float, nullable=False)
    carbs_per_gram = Column(Float, nullable=False)
    fat_per_gram = Column(Float, nullable=False)
