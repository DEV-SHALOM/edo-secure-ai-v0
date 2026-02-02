from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Camera
from schemas import CameraResponse, CameraCreate

router = APIRouter()

def format_camera(camera: Camera) -> dict:
    return {
        "id": str(camera.id),
        "name": camera.name,
        "location": camera.location,
        "latitude": camera.latitude,
        "longitude": camera.longitude,
        "status": camera.status,
        "type": camera.type,
        "streamUrl": camera.stream_url or "",
    }

@router.get("")
def get_cameras(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Camera)
    
    if status:
        query = query.filter(Camera.status == status)
    
    cameras = query.all()
    return [format_camera(c) for c in cameras]

@router.get("/{camera_id}")
def get_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return format_camera(camera)

@router.post("")
def create_camera(camera: CameraCreate, db: Session = Depends(get_db)):
    db_camera = Camera(**camera.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return format_camera(db_camera)

@router.patch("/{camera_id}/status")
def update_camera_status(
    camera_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    camera.status = status
    db.commit()
    db.refresh(camera)
    return format_camera(camera)
