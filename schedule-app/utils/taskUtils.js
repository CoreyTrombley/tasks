// Task management utility functions
// Based on the CLI script functionality

// Days to assign tasks to
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Fixed Monday tasks (these won't be randomized)
export const MONDAY_TASKS = ['Application Send', 'Follow Ups', 'Job Search'];

/**
 * Load tasks from localStorage
 * @returns {Array} Array of task objects with structure: { text: string, subtasks: Array }
 */
export function loadTasks() {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return [];
  }

  try {
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) {
      return [];
    }

    const tasks = JSON.parse(storedTasks);
    
    // Ensure all tasks have the new structure with subtasks
    return tasks.map(task => {
      if (typeof task === 'string') {
        // Handle old string format
        return { text: task, subtasks: [] };
      } else if (task.text && !task.subtasks) {
        // Handle old object format without subtasks
        return { ...task, subtasks: [] };
      }
      return task;
    });
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}

/**
 * Save tasks to localStorage
 * @param {Array} tasks - Array of task objects to save
 */
export function saveTasks(tasks) {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return;
  }

  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

/**
 * Shuffle an array in-place using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} The shuffled array
 */
export function shuffle(array) {
  const shuffled = [...array]; // Create a copy to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a weekly schedule by randomly assigning tasks to days
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Schedule object with days as keys and task arrays as values
 */
export function generateSchedule(tasks) {
  if (!Array.isArray(tasks)) {
    console.error('generateSchedule: tasks must be an array');
    return {};
  }

  // Start with Monday tasks (fixed)
  const assignments = {
    'Monday': MONDAY_TASKS.map(text => ({ text, subtasks: [] }))
  };

  // If no user tasks, just return Monday tasks
  if (tasks.length === 0) {
    // Initialize empty arrays for other days
    DAYS.slice(1).forEach(day => {
      assignments[day] = [];
    });
    return assignments;
  }

  // Shuffle the user tasks
  const shuffledTasks = shuffle(tasks);

  // Map them to Tuesday-Friday (wrap if more tasks than days)
  const weekdays = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Initialize empty arrays for all weekdays
  weekdays.forEach(day => {
    assignments[day] = [];
  });

  // Distribute tasks across Tuesday-Friday
  shuffledTasks.forEach((task, index) => {
    const day = weekdays[index % weekdays.length];
    assignments[day].push(task);
  });

  return assignments;
}

/**
 * Add a new task to the task list
 * @param {Array} tasks - Current tasks array
 * @param {string} taskText - Text for the new task
 * @returns {Array} Updated tasks array
 */
export function addTask(tasks, taskText) {
  if (!taskText || typeof taskText !== 'string') {
    throw new Error('Task text must be a non-empty string');
  }

  const newTask = {
    text: taskText.trim(),
    subtasks: []
  };

  return [...tasks, newTask];
}

/**
 * Remove a task from the task list
 * @param {Array} tasks - Current tasks array
 * @param {number} taskIndex - Index of the task to remove
 * @returns {Array} Updated tasks array
 */
export function removeTask(tasks, taskIndex) {
  if (taskIndex < 0 || taskIndex >= tasks.length) {
    throw new Error('Invalid task index');
  }

  return tasks.filter((_, index) => index !== taskIndex);
}

/**
 * Add a subtask to an existing task
 * @param {Array} tasks - Current tasks array
 * @param {number} taskIndex - Index of the parent task
 * @param {string} subtaskText - Text for the new subtask
 * @returns {Array} Updated tasks array
 */
export function addSubtask(tasks, taskIndex, subtaskText) {
  if (taskIndex < 0 || taskIndex >= tasks.length) {
    throw new Error('Invalid task index');
  }

  if (!subtaskText || typeof subtaskText !== 'string') {
    throw new Error('Subtask text must be a non-empty string');
  }

  const updatedTasks = [...tasks];
  const newSubtask = { text: subtaskText.trim() };
  
  updatedTasks[taskIndex] = {
    ...updatedTasks[taskIndex],
    subtasks: [...updatedTasks[taskIndex].subtasks, newSubtask]
  };

  return updatedTasks;
}

/**
 * Remove a subtask from a task
 * @param {Array} tasks - Current tasks array
 * @param {number} taskIndex - Index of the parent task
 * @param {number} subtaskIndex - Index of the subtask to remove
 * @returns {Array} Updated tasks array
 */
export function removeSubtask(tasks, taskIndex, subtaskIndex) {
  if (taskIndex < 0 || taskIndex >= tasks.length) {
    throw new Error('Invalid task index');
  }

  const task = tasks[taskIndex];
  if (subtaskIndex < 0 || subtaskIndex >= task.subtasks.length) {
    throw new Error('Invalid subtask index');
  }

  const updatedTasks = [...tasks];
  updatedTasks[taskIndex] = {
    ...task,
    subtasks: task.subtasks.filter((_, index) => index !== subtaskIndex)
  };

  return updatedTasks;
}

/**
 * Format schedule for display
 * @param {Object} schedule - Schedule object from generateSchedule
 * @returns {string} Formatted schedule string
 */
export function formatSchedule(schedule) {
  let formatted = '🎲 Your randomized task schedule:\n\n';
  
  DAYS.forEach(day => {
    formatted += `  ${day}:\n`;
    if (schedule[day] && schedule[day].length > 0) {
      schedule[day].forEach((task, idx) => {
        formatted += `    • ${task.text}\n`;
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach((subtask, subIdx) => {
            formatted += `      ${subIdx + 1}. ${subtask.text}\n`;
          });
        }
      });
    } else {
      formatted += '    (no tasks)\n';
    }
  });
  
  return formatted;
}
