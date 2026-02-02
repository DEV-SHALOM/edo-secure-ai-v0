from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    name: str
    role: str = "operator"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class IncidentBase(BaseModel):
    type: str
    severity: str
    location: str
    latitude: float
    longitude: float
    description: str
    confidence: float
    camera_id: str

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: str
    status: str
    timestamp: datetime
    cameraId: str
    videoClipUrl: Optional[str] = None

    class Config:
        from_attributes = True

class IncidentUpdate(BaseModel):
    status: Optional[str] = None

class CameraBase(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    status: str = "online"
    type: str = "cctv"
    stream_url: str = ""

class CameraCreate(CameraBase):
    pass

class CameraResponse(BaseModel):
    id: str
    name: str
    location: str
    latitude: float
    longitude: float
    status: str
    type: str
    streamUrl: str

    class Config:
        from_attributes = True
