from pydantic import BaseModel, EmailStr
from pydantic.types import StringConstraints
from typing_extensions import Annotated

Password = Annotated[
    str,
    StringConstraints(min_length=8, max_length=64)
]

class RegisterRequest(BaseModel):
    email: EmailStr
    password: Password

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
