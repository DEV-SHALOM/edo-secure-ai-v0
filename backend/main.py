import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, incidents, cameras
from websocket_manager import manager
from demo_data import seed_demo_data
from ai_service import ai_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
    asyncio.create_task(simulate_incidents())
    yield

app = FastAPI(
    title="EdoSecure AI API",
    description="Security Intelligence Platform Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "https://edo-secure-ai-v0-21bb.vercel.app",
        "https://b8541d24-982f-4ccd-aabf-fee2ae51bb54-00-vkifhihicl2r.spock.replit.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(cameras.router, prefix="/api/cameras", tags=["Cameras"])

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "EdoSecure AI"}

@app.post("/api/ai/process")
async def process_video_feed(camera_id: str):
    # Simulate receiving a trigger to process a specific camera feed
    # In reality, this might start a thread that reads from an RTSP stream
    result = ai_service.process_frame(None)
    return {"camera_id": camera_id, "analysis": result}

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def simulate_incidents():
    import random
    from datetime import datetime
    from database import SessionLocal
    from models import Incident
    
    incident_types = ['crowd_detection', 'person_detection', 'motion_anomaly', 'night_activity']
    severities = ['low', 'medium', 'high', 'critical']
    locations = [
        ("Ring Road", 6.3350, 5.6037),
        ("Sapele Road", 6.3180, 5.6120),
        ("Airport Road", 6.3050, 5.5990),
        ("New Benin", 6.3420, 5.6280),
        ("GRA", 6.3290, 5.6350),
    ]
    
    await asyncio.sleep(30)
    
    while True:
        await asyncio.sleep(random.randint(45, 120))
        
        location = random.choice(locations)
        incident_type = random.choice(incident_types)
        severity = random.choices(severities, weights=[4, 3, 2, 1])[0]
        
        db = SessionLocal()
        try:
            # Use AI Service to "analyze" before creating incident
            ai_result = ai_service.process_frame(None)
            anomaly_result = ai_service.detect_anomalies([])
            
            # If AI detects something, or based on simulation
            confidence_val = 0.8
            if ai_result.get('detections') and len(ai_result['detections']) > 0:
                confidence_val = ai_result['detections'][0].get('confidence', 0.8)

            incident = Incident(
                type=incident_type,
                severity=severity,
                location=location[0],
                latitude=location[1] + random.uniform(-0.01, 0.01),
                longitude=location[2] + random.uniform(-0.01, 0.01),
                description=f"{incident_type.replace('_', ' ').title()} detected at {location[0]}. AI Confidence: {ai_result.get('count', 0)} persons found.",
                confidence=confidence_val,
                camera_id=f"CAM-{random.randint(1, 8):03d}",
                status="active"
            )
            db.add(incident)
            db.commit()
            db.refresh(incident)
            
            await manager.broadcast({
                "type": "new_incident",
                "data": {
                    "id": str(incident.id),
                    "type": incident.type,
                    "severity": incident.severity,
                    "location": incident.location,
                    "latitude": incident.latitude,
                    "longitude": incident.longitude,
                    "timestamp": incident.created_at.isoformat(),
                    "description": incident.description,
                    "confidence": incident.confidence,
                    "cameraId": incident.camera_id,
                    "status": incident.status,
                }
            })
        finally:
            db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
