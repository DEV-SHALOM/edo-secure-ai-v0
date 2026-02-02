from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Incident
from schemas import IncidentResponse, IncidentCreate, IncidentUpdate

router = APIRouter()

def format_incident(incident: Incident) -> dict:
    return {
        "id": str(incident.id),
        "type": incident.type,
        "severity": incident.severity,
        "location": incident.location,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "timestamp": incident.created_at.isoformat() if incident.created_at else "",
        "description": incident.description,
        "confidence": incident.confidence,
        "cameraId": incident.camera_id,
        "status": incident.status,
        "videoClipUrl": incident.video_clip_url,
    }

@router.get("")
def get_incidents(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    
    if status:
        query = query.filter(Incident.status == status)
    if severity:
        query = query.filter(Incident.severity == severity)
    
    incidents = query.order_by(Incident.created_at.desc()).limit(limit).all()
    return [format_incident(i) for i in incidents]

@router.get("/{incident_id}")
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return format_incident(incident)

@router.post("")
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    db_incident = Incident(**incident.model_dump())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return format_incident(db_incident)

@router.patch("/{incident_id}")
def update_incident(
    incident_id: int,
    update: IncidentUpdate,
    db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if update.status:
        incident.status = update.status
    
    db.commit()
    db.refresh(incident)
    return format_incident(incident)
