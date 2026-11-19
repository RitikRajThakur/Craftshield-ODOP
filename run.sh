#!/bin/bash

# =============================================================================
# CraftShield ODOP - One-Click Project Launcher
# =============================================================================

echo "================================================================="
echo "   🛡️  CraftShield ODOP - AI Handicraft Authenticity Assistant    "
echo "================================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Start Python FastAPI Backend Server
echo "[1/2] Starting Backend API Server on http://localhost:8000..."
cd "$DIR"
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 2

# 2. Start Frontend Vite Web Application
echo "[2/2] Starting React Frontend on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "🚀 CraftShield ODOP is LIVE!"
echo "   👉 Frontend Web App:  http://localhost:5173"
echo "   👉 Backend API:       http://localhost:8000"
echo "   👉 Swagger API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT
wait
