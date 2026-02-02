import random
from datetime import datetime, timedelta
from database import SessionLocal
from models import User, Camera, Incident
from auth_utils import get_password_hash

def seed_demo_data():
    db = SessionLocal()
    
    try:
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("Demo data already exists, skipping seed...")
            return
        
        admin = User(
            username="admin",
            hashed_password=get_password_hash("admin123"),
            name="Admin User",
            role="admin",
            is_active=True
        )
        operator = User(
            username="operator",
            hashed_password=get_password_hash("operator123"),
            name="Security Operator",
            role="operator",
            is_active=True
        )
        db.add_all([admin, operator])
        
        cameras_data = [
            ("CAM-001", "Ring Road Camera 1", "Ring Road, Benin City", 6.3350, 5.6037),
            ("CAM-002", "Sapele Road Camera", "Sapele Road Junction", 6.3180, 5.6120),
            ("CAM-003", "Airport Road Camera", "Airport Road Entrance", 6.3050, 5.5990),
            ("CAM-004", "New Benin Camera", "New Benin Market Area", 6.3420, 5.6280),
            ("CAM-005", "GRA Camera", "GRA Main Gate", 6.3290, 5.6350),
            ("CAM-006", "Uselu Camera", "Uselu Market", 6.3580, 5.6180),
            ("CAM-007", "Third Circular Road", "Third Circular Junction", 6.3150, 5.6400),
            ("CAM-008", "Akpakpava Camera", "Akpakpava Road", 6.3380, 5.6150),
        ]
        
        for name, desc, location, lat, lng in cameras_data:
            status = random.choices(["online", "offline", "maintenance"], weights=[8, 1, 1])[0]
            camera = Camera(
                name=name,
                location=location,
                latitude=lat,
                longitude=lng,
                status=status,
                type="cctv",
                stream_url=f"/streams/{name.lower()}"
            )
            db.add(camera)
        
        incident_types = ['crowd_detection', 'person_detection', 'motion_anomaly', 'night_activity', 'restricted_area']
        severities = ['low', 'medium', 'high', 'critical']
        statuses = ['active', 'acknowledged', 'resolved']
        
        locations = [
            ("Ring Road", 6.3350, 5.6037),
            ("Sapele Road", 6.3180, 5.6120),
            ("Airport Road", 6.3050, 5.5990),
            ("New Benin", 6.3420, 5.6280),
            ("GRA", 6.3290, 5.6350),
            ("Uselu", 6.3580, 5.6180),
            ("Akpakpava", 6.3380, 5.6150),
        ]
        
        for i in range(25):
            location = random.choice(locations)
            incident_type = random.choice(incident_types)
            severity = random.choices(severities, weights=[4, 3, 2, 1])[0]
            status = random.choices(statuses, weights=[3, 2, 5])[0]
            
            hours_ago = random.randint(1, 168)
            created_at = datetime.utcnow() - timedelta(hours=hours_ago)
            
            incident = Incident(
                type=incident_type,
                severity=severity,
                location=location[0],
                latitude=location[1] + random.uniform(-0.005, 0.005),
                longitude=location[2] + random.uniform(-0.005, 0.005),
                description=f"{incident_type.replace('_', ' ').title()} detected at {location[0]}",
                confidence=random.uniform(0.70, 0.98),
                camera_id=f"CAM-{random.randint(1, 8):03d}",
                status=status,
                created_at=created_at
            )
            db.add(incident)
        
        db.commit()
        print("Demo data seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding demo data: {e}")
        db.rollback()
    finally:
        db.close()
