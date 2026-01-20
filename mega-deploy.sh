#!/bin/bash

# MEGA Integrated Deployment Script
# Usage: ./mega-deploy.sh "Brief description of changes"

CHANGES=$1

if [ -z "$CHANGES" ]; then
    echo "Error: Please provide a description of changes."
    echo "Usage: ./mega-deploy.sh \"Your change description\""
    exit 1
fi

echo "🚀 Starting MEGA Deployment Flow..."

# 1. Update Release Notes
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
DATE_VAL=$(date "+%Y-%m-%d")

echo "📝 Updating RELEASE_NOTES.md..."
if [ ! -f RELEASE_NOTES.md ]; then
    echo "# MEGA Release History" > RELEASE_NOTES.md
fi

# Insert new changes at the top
TEMP_FILE=$(mktemp)
echo "## Release $DATE_VAL ($TIMESTAMP)" > "$TEMP_FILE"
echo "- **Summary**: $CHANGES" >> "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
cat RELEASE_NOTES.md >> "$TEMP_FILE"
mv "$TEMP_FILE" RELEASE_NOTES.md

# 2. Git Operations
echo "📦 Committing changes to Github..."
git add .
git commit -m "SEC: Mega Update - $CHANGES"
git push origin main

# 3. Deployment Summary
echo "-----------------------------------------------"
echo "✅ SUCCESS: Code pushed and documentation updated."
echo "🔗 Deployment URL: http://localhost:3000 (Local Dev)"
echo "📄 Release Doc: RELEASE_NOTES.md updated."
echo "-----------------------------------------------"
