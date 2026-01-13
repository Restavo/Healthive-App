from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Enum,
    ForeignKey,
    DateTime
)
from sqlalchemy.sql import func
from app.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    name = Column(String(100), nullable=False)

    weight = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    age = Column(Integer, nullable=False)

    gender = Column(
        Enum("Laki-laki", "Perempuan"),
        nullable=False
    )

    activity_level = Column(
        Enum(
            "Kurang Aktif",
            "Sedikit Aktif",
            "Cukup Aktif",
            "Sangat Aktif",
            "Ekstra Aktif"
        ),
        nullable=False
    )

    goal = Column(
        Enum("lose", "maintain", "gain"),
        nullable=False
    )

    target_weight = Column(Float, nullable=False)
    duration_months = Column(Integer, nullable=False)

    bmi = Column(Float, nullable=False)
    daily_target = Column(Integer, nullable=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )
