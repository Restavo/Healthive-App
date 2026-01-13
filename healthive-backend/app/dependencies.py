from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.services.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    print("RAW TOKEN:", token)
    print("SECRET_KEY:", SECRET_KEY)
    print("ALGORITHM:", ALGORITHM)

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        print("DECODED PAYLOAD:", payload)
        return int(payload["sub"])

    except JWTError as e:
        print("JWT ERROR TYPE:", type(e))
        print("JWT ERROR MSG :", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")
