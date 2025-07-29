# Weekly Task Scheduler

A simple CLI tool to randomly assign tasks to weekdays (Tuesday-Friday) with automatic email scheduling.

## Features

- ✅ Add and remove tasks interactively
- ✅ Random task assignment to weekdays
- ✅ Email delivery of weekly schedules
- ✅ Automatic scheduling via cron jobs
- ✅ Beautiful HTML email formatting

## Quick Setup

### 1. Install Dependencies
```bash
cd tasks
npm install
```

### 2. Set Up Email Configuration
Copy the example environment file and configure your email settings:
```bash
cd tasks
cp env.example .env
nano .env  # or your preferred editor
```

**For Gmail users:**
1. Enable 2-factor authentication
2. Generate an App Password (Google Account → Security → App Passwords)
3. Use the App Password as `EMAIL_PASS` in your `.env` file

### 3. Set Up Automatic Scheduling
```bash
cd tasks
./setup-cron.sh
```

This will create a cron job that runs every Monday at 12:00 AM.

## Usage

### Basic Commands
```bash
# Add a new task
tasks add "Water the plants"

# List all tasks
tasks list

# Remove tasks interactively
tasks remove

# Generate and send weekly schedule
tasks schedule

# Generate schedule without email (display only)
tasks assign
```

### Email Options
```bash
# Send to default email (EMAIL_TO env var)
tasks schedule

# Send to specific email
tasks schedule your-email@example.com
```

## Email Features

- **HTML Formatting**: Beautiful styled emails with your weekly schedule
- **Date Range**: Shows the week's date range
- **Task Organization**: Tasks organized by day (Tuesday-Friday)
- **Fallback Text**: Plain text version for email clients that don't support HTML

## Cron Job Details

The setup script creates a cron job that runs:
- **When**: Every Monday at 12:00 AM
- **What**: Generates and emails your weekly task schedule
- **Where**: Uses your configured email settings

### Manual Cron Management
```bash
# View current cron jobs
crontab -l

# Edit cron jobs manually
crontab -e

# Remove all cron jobs
crontab -r
```

## File Structure

```
├── tasks-launcher     # Launcher script (in bin directory)
├── tasks/            # Main project folder
│   ├── tasks         # Main CLI script
│   ├── package.json  # Dependencies
│   ├── setup-cron.sh # Automatic setup script
│   ├── env.example   # Environment variables template
│   ├── .env          # Your email configuration (create this)
│   ├── tasks.json    # Task storage (created automatically)
│   └── README.md     # This file
```

## Environment Variables

Create a `.env` file in the `tasks` directory with these variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Your email address | Yes |
| `EMAIL_PASS` | Your email password/app password | Yes |
| `EMAIL_TO` | Recipient email address | Yes |
| `SMTP_HOST` | SMTP server (default: smtp.gmail.com) | No |
| `SMTP_PORT` | SMTP port (default: 587) | No |

Example `.env` file:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=your-email@example.com
```

## Troubleshooting

### Email Not Sending
1. Check `.env` file exists and has correct values: `cat tasks/.env`
2. Verify Gmail App Password is correct
3. Test manually: `tasks schedule your-email@example.com`

### Cron Job Not Running
1. Check cron service: `sudo systemctl status cron`
2. View cron logs: `grep CRON /var/log/syslog`
3. Test cron job manually: `tasks schedule`

### Permission Issues
```bash
chmod +x tasks/tasks
chmod +x tasks/setup-cron.sh
chmod +x tasks-launcher
```

## Example Weekly Schedule Email

```
🎲 Your Weekly Task Schedule
Week of: 1/15/2024 - 1/21/2024

Tuesday:
  1. Water the plants
  2. Review budget

Wednesday:
  1. Call dentist
  2. Clean kitchen

Thursday:
  1. Grocery shopping
  2. Pay bills

Friday:
  1. Exercise
  2. Plan weekend
```

## License

MIT License - feel free to modify and distribute! 