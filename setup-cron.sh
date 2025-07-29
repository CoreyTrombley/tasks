#!/bin/bash

# Setup script for automatic weekly task scheduling
# This script sets up a cron job to run every Monday at 12:00 AM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TASKS_SCRIPT="$SCRIPT_DIR/tasks"
BIN_DIR="$(dirname "$SCRIPT_DIR")"
BIN_TASKS="$BIN_DIR/tasks-launcher"

echo "🚀 Setting up automatic weekly task scheduling..."

# Check if tasks script exists and is executable
if [ ! -f "$TASKS_SCRIPT" ]; then
    echo "❌ Error: tasks script not found at $TASKS_SCRIPT"
    exit 1
fi

# Make sure the script is executable
chmod +x "$TASKS_SCRIPT"

# Check if nodemailer is installed
if ! node -e "require('nodemailer')" 2>/dev/null; then
    echo "📦 Installing nodemailer dependency..."
    npm install
fi

# Create the cron job entry
CRON_JOB="0 0 * * 1 $BIN_TASKS schedule"

echo "📅 Setting up cron job to run every Monday at 12:00 AM..."
echo "Cron job: $CRON_JOB"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$BIN_TASKS schedule"; then
    echo "⚠️  Cron job already exists. Updating..."
    # Remove existing cron job
    crontab -l 2>/dev/null | grep -v "$BIN_TASKS schedule" | crontab -
fi

# Add the new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job installed successfully!"
echo ""
echo "📧 Email Configuration Required:"
echo "Copy env.example to .env and configure your email settings:"
echo ""
echo "cp env.example .env"
echo "nano .env  # or your preferred editor"
echo ""
echo "💡 For Gmail, you'll need to:"
echo "1. Enable 2-factor authentication"
echo "2. Generate an App Password"
echo "3. Use the App Password as EMAIL_PASS in your .env file"
echo ""
echo "🔄 The schedule will now run automatically every Monday at 12:00 AM"
echo "📋 You can test it manually with: tasks schedule" 