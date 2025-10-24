#!/bin/bash

# MNR Client Intake System - Development Startup Script
# Ensures consistent 3020 series port usage

echo "🚀 Starting MNR Client Intake System Development Servers"
echo "========================================================"

# Kill any existing processes on our target ports
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*3020" 2>/dev/null || true
pkill -f "node.*3021" 2>/dev/null || true
pkill -f "vite.*3020" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Start backend on port 3021
echo "🔧 Starting Backend on port 3021..."
cd backend
PORT=3021 npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3021/health > /dev/null; then
    echo "✅ Backend started successfully on port 3021"
else
    echo "❌ Backend failed to start on port 3021"
    exit 1
fi

# Start frontend on port 3020
echo "🎨 Starting Frontend on port 3020..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:3020 > /dev/null; then
    echo "✅ Frontend started successfully on port 3020"
else
    echo "❌ Frontend failed to start on port 3020"
    exit 1
fi

echo ""
echo "🎉 Development servers are running!"
echo "=================================="
echo "Frontend: http://localhost:3020"
echo "Backend:  http://localhost:3021"
echo "Health:   http://localhost:3021/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait