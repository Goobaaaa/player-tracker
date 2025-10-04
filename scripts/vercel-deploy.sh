#!/bin/bash

# Vercel Deployment Script for Player Tracker
echo "🚀 Starting Vercel deployment process..."

# Check if we have a DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set. Please set it in your Vercel environment variables."
    exit 1
fi

# Generate Prisma client
echo "📝 Generating Prisma client..."
npx prisma generate

# Push database schema to production (alternative to migrate)
echo "🔄 Pushing database schema to production..."
npx prisma db push

# Run seed script if needed
echo "🌱 Running database seed..."
npx prisma db seed

echo "✅ Database setup complete!"
echo "🎯 Your application is ready for deployment."