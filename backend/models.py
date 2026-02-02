from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum
from sqlalchemy.sql import func
import enum
from database import Base

class IncidentType(str, enum.Enum):
    crowd_detection = "crowd_detection"
    person_detection = "person_detection"
    motion_anomaly = "motion_anomaly"
    night_activity = "night_activity"
    restricted_area = "restricted_area"

class Severity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class IncidentStatus(str, enum.Enum):
    active = "active"
    acknowledged = "acknowledged"
    resolved = "resolved"

class CameraStatus(str, enum.Enum):
    online = "online"
    offline = "offline"
    maintenance = "maintenance"

class CameraType(str, enum.Enum):
    cctv = "cctv"
    drone = "drone"
    mobile = "mobile"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String, default="operator")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    severity = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    description = Column(String)
    confidence = Column(Float)
    camera_id = Column(String)
    status = Column(String, default="active")
    video_clip_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="online")
    type = Column(String, default="cctv")
    stream_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
