# EdoSecure AI - Security Intelligence Platform

## Overview
EdoSecure AI is an AI-powered security intelligence and surveillance coordination platform designed for government security operations. It provides real-time incident detection, map-based visualization, and centralized command dashboard.

## Project Structure

```
/
├── src/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
├── backend/               # FastAPI backend
│   ├── routers/           # API route handlers
│   ├── models.py          # SQLAlchemy database models
│   ├── schemas.py         # Pydantic schemas
│   ├── database.py        # Database configuration
│   ├── auth_utils.py      # Authentication utilities
│   ├── websocket_manager.py # WebSocket connection manager
│   └── demo_data.py       # Demo data seeder
└── package.json           # Node.js dependencies
```

## Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Leaflet Maps, Recharts
- **Backend**: Python FastAPI, SQLAlchemy, PostgreSQL
- **Real-time**: WebSockets for live alerts

## Key Features
1. **Dashboard** - Centralized security command view
2. **Live Cameras** - Simulated video feed panels
3. **Incident Alerts** - Real-time alert notifications
4. **Map View** - Leaflet map with incident markers
5. **Analytics** - Charts and statistics

## Demo Credentials
- Username: `admin`
- Password: `admin123`

## Running the Application
- Frontend runs on port 5000
- Backend runs on port 8000
- WebSocket connection: `/ws/alerts`

## Recent Changes
- Initial MVP implementation
- Created frontend dashboard with all components
- Built FastAPI backend with authentication
- Added real-time incident simulation
