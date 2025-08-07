<general_rules>
- Always maintain the existing code style and structure when making modifications to the `tasks` script
- The main executable script is `tasks` - ensure it remains executable with proper shebang (`#!/usr/bin/env node`)
- When adding new functionality, follow the existing pattern of defining functions at the top of the file and handling commands in the main switch statement
- Preserve the existing task data structure: tasks are objects with `text` and `subtasks` properties
- Always use `loadTasks()` and `saveTasks()` functions for data persistence - never directly manipulate the `tasks.json` file
- When modifying the email functionality, ensure backward compatibility with existing environment variable names
- Fixed Monday tasks (Job Search activities) should never be randomized - they are defined in the `MONDAY_TASKS` constant
- Use clear, descriptive variable and function names following the existing naming conventions
- Add comments only for complex logic that wouldn't be obvious to maintainers
- Test all changes thoroughly using the manual testing approach before submitting
</general_rules>

<repository_structure>
- **Root Directory**: Contains all project files in a flat structure with no subdirectories
- **`tasks`**: Main executable Node.js script containing all CLI functionality and business logic
- **`setup-cron.sh`**: Bash script for setting up automatic weekly scheduling via cron jobs
- **`package.json`**: Defines project metadata, dependencies (nodemailer, dotenv), and npm scripts
- **`env.example`**: Template file for email configuration that users copy to `.env`
- **`tasks.json`**: Runtime data file storing user tasks (gitignored, created automatically)
- **`.env`**: User's email configuration file (gitignored, created from env.example)
- The CLI tool operates by loading tasks from `tasks.json`, processing commands, and optionally sending emails via nodemailer
- Monday tasks are hardcoded in the script, while Tuesday-Friday tasks are randomly assigned from the user's task list
</repository_structure>

<dependencies_and_installation>
- **Package Manager**: npm (Node.js required)
- **Core Dependencies**: `nodemailer` for email functionality, `dotenv` for environment variable management
- **Installation Steps**:
  1. Run `npm install` to install dependencies
  2. Make scripts executable: `chmod +x tasks` and `chmod +x setup-cron.sh`
  3. Copy `env.example` to `.env` and configure email settings
- **Email Configuration**: Requires valid SMTP credentials in `.env` file (Gmail setup instructions provided in README)
- **Optional Setup**: Run `./setup-cron.sh` to enable automatic weekly scheduling
- No build process or additional tooling required - the application runs directly with Node.js
</dependencies_and_installation>

<testing_instructions>
- **Testing Approach**: Manual testing only - no automated testing framework is used
- **Basic Functionality Testing**:
  - Test task management: `./tasks add "Test task"`, `./tasks list`, `./tasks remove`
  - Test task assignment: `./tasks assign` (should show randomized schedule)
  - Test subtask functionality: `./tasks add-subtask 1 "Test subtask"`
- **Email Functionality Testing**:
  - Requires `.env` file with valid email credentials
  - Test with: `./tasks schedule your-email@example.com`
  - Verify HTML email is received with proper formatting
- **Cron Setup Testing**: Run `./setup-cron.sh` and verify cron job is created
- **Data Persistence Testing**: Ensure tasks persist between CLI invocations by checking `tasks.json`
- Always test that existing functionality continues to work after making changes
</testing_instructions>

<pull_request_formatting>
</pull_request_formatting>
