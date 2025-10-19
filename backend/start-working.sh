#!/bin/bash

echo "🚀 Starting MNR Client Intake Backend (Working Version)..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 20

# Initialize database
echo "🔄 Initializing database..."
node init-db-simple.js

# Start the application
echo "✅ Starting application..."
node dist/index.js
