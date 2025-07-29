# Weekly Task Scheduler

A simple CLI tool to randomly assign tasks to weekdays (Monday-Friday) with automatic email scheduling.

## Features

- ✅ Add and remove tasks interactively
- ✅ Add subtasks to existing tasks
- ✅ Random task assignment to weekdays
- ✅ Email delivery of weekly schedules
- ✅ Automatic scheduling via cron jobs
- ✅ Beautiful HTML email formatting
- ✅ Fixed Monday tasks (Job Search activities)

## Installation & Setup

### 1. Clone and Install Dependencies
```bash
# Navigate to the project directory
cd tasks-scheduler

# Install Node.js dependencies
npm install
```

### 2. Make the CLI Executable
```bash
# Make the main script executable
chmod +x tasks

# Make the setup script executable
chmod +x setup-cron.sh
```

### 3. Set Up Email Configuration
Copy the example environment file and configure your email settings:
```bash
cp env.example .env
nano .env  # or your preferred editor
```

**For Gmail users:**
1. Enable 2-factor authentication
2. Generate an App Password (Google Account → Security → App Passwords)
3. Use the App Password as `EMAIL_PASS` in your `.env` file

### 4. Set Up Automatic Scheduling (Optional)
```bash
./setup-cron.sh
```

This will create a cron job that runs every Monday at 12:00 AM.

## CLI Usage

The tool provides a simple command-line interface. All commands should be run from the project directory.

### Basic Commands

```bash
# Add a new task
./tasks add "Water the plants"

# List all tasks
./tasks list

# Remove tasks interactively
./tasks remove

# Generate and display weekly schedule (no email)
./tasks assign

# Generate and send weekly schedule via email
./tasks schedule

# Add a subtask to an existing task
./tasks add-subtask 1 "Buy fertilizer"
```

### Email Options

```bash
# Send to default email (EMAIL_TO env var)
./tasks schedule

# Send to specific email address
./tasks schedule your-email@example.com
```

### Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `add "Task Name"` | Add a new task | `./tasks add "Call dentist"` |
| `add-subtask N "Subtask"` | Add subtask to task #N | `./tasks add-subtask 1 "Buy toothpaste"` |
| `list` | Show all current tasks | `./tasks list` |
| `remove` | Interactive task removal | `./tasks remove` |
| `assign` | Generate and display schedule | `./tasks assign` |
| `schedule` | Generate and email schedule | `./tasks schedule` |
| `schedule email@example.com` | Send to specific email | `./tasks schedule user@example.com` |

## Task Management

### Adding Tasks
```bash
# Add simple tasks
./tasks add "Water the plants"
./tasks add "Call dentist"
./tasks add "Grocery shopping"

# Add tasks with subtasks
./tasks add "Clean kitchen"
./tasks add-subtask 3 "Wash dishes"
./tasks add-subtask 3 "Wipe counters"
```

### Viewing Tasks
```bash
./tasks list
```

Example output:
```
Current Tasks:
1. Water the plants
2. Call dentist
3. Clean kitchen
   - Wash dishes
   - Wipe counters
4. Grocery shopping
```

### Removing Tasks
```bash
./tasks remove
```

This will show an interactive menu where you can select tasks to remove.

## Weekly Schedule

The tool assigns tasks to weekdays as follows:

- **Monday**: Fixed tasks (Job Search, Application Send, Follow Ups)
- **Tuesday-Friday**: Randomly assigned from your task list

### Generate Schedule
```bash
# Display schedule without sending email
./tasks assign

# Generate and email schedule
./tasks schedule
```

Example schedule output:
```
🎲 Your randomized task schedule:

  Monday:
    • Application Send
    • Follow Ups
    • Job Search

  Tuesday:
    • Water the plants

  Wednesday:
    • Call dentist

  Thursday:
    • Clean kitchen
      - Wash dishes
      - Wipe counters

  Friday:
    • Grocery shopping
```

## Email Features

- **HTML Formatting**: Beautiful styled emails with your weekly schedule
- **Date Range**: Shows the week's date range
- **Task Organization**: Tasks organized by day (Monday-Friday)
- **Fallback Text**: Plain text version for email clients that don't support HTML

## Environment Configuration

Create a `.env` file in the project directory with these variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Your email address | Yes |
| `EMAIL_PASS` | Your email password/app password | Yes |
| `EMAIL_TO` | Default recipient email address | No |
| `SMTP_HOST` | SMTP server (default: smtp.gmail.com) | No |
| `SMTP_PORT` | SMTP port (default: 587) | No |

Example `.env` file:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=your-email@example.com
```

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
tasks-scheduler/
├── tasks              # Main CLI script
├── package.json       # Dependencies
├── setup-cron.sh      # Automatic setup script
├── env.example        # Environment variables template
├── .env               # Your email configuration (create this)
├── tasks.json         # Task storage (created automatically)
└── README.md          # This file
```

## Troubleshooting

### Permission Issues
```bash
# Make scripts executable
chmod +x tasks
chmod +x setup-cron.sh
```

### Email Not Sending
1. Check `.env` file exists and has correct values: `cat .env`
2. Verify Gmail App Password is correct
3. Test manually: `./tasks schedule your-email@example.com`

### Cron Job Not Running
1. Check cron service: `sudo systemctl status cron`
2. View cron logs: `grep CRON /var/log/syslog`
3. Test cron job manually: `./tasks schedule`

### No Tasks Found
```bash
# Add some tasks first
./tasks add "Your first task"
./tasks list  # Verify tasks are added
```

## Example Workflow

```bash
# 1. Set up the tool
npm install
chmod +x tasks
cp env.example .env
# Edit .env with your email settings

# 2. Add your tasks
./tasks add "Water the plants"
./tasks add "Call dentist"
./tasks add "Grocery shopping"
./tasks add-subtask 3 "Buy milk"
./tasks add-subtask 3 "Buy bread"

# 3. View your tasks
./tasks list

# 4. Generate a schedule
./tasks assign

# 5. Send schedule via email
./tasks schedule

# 6. Set up automatic scheduling (optional)
./setup-cron.sh
```

## Contributing

We welcome contributions to improve the Weekly Task Scheduler! Here's how you can help:

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them thoroughly
4. **Commit your changes** with clear, descriptive commit messages
5. **Push to your fork** and submit a pull request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/tasks-scheduler.git
cd tasks-scheduler

# Install dependencies
npm install

# Make scripts executable
chmod +x tasks
chmod +x setup-cron.sh

# Set up environment
cp env.example .env
# Edit .env with your email settings for testing
```

### Testing Your Changes

```bash
# Test basic functionality
./tasks add "Test task"
./tasks list
./tasks assign

# Test email functionality (requires .env setup)
./tasks schedule your-email@example.com
```

### Areas for Contribution

- **Bug fixes**: Report and fix any issues you encounter
- **New features**: Add useful functionality like:
  - Task categories/tags
  - Priority levels
  - Recurring tasks
  - Calendar integration
  - Mobile app companion
- **Documentation**: Improve README, add examples, create tutorials
- **Code quality**: Refactor, optimize, add tests
- **UI/UX**: Enhance email templates, improve CLI output

### Code Style Guidelines

- Use clear, descriptive variable and function names
- Add comments for complex logic
- Follow existing code formatting
- Test your changes thoroughly
- Update documentation as needed

### Reporting Issues

When reporting bugs or requesting features:

1. Check if the issue already exists
2. Provide a clear description of the problem
3. Include steps to reproduce the issue
4. Mention your operating system and Node.js version
5. Include any error messages or logs

### Pull Request Guidelines

- Keep changes focused and atomic
- Include tests if applicable
- Update documentation for new features
- Ensure all existing functionality still works
- Add your name to contributors if you'd like

Thank you for contributing to make this tool better for everyone!

## License

MIT License - feel free to modify and distribute! 