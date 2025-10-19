#!/bin/bash

echo "🚀 Starting MNR Client Intake Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma db push --force-reset

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Start the application
echo "✅ Starting application..."
node dist/index.js
