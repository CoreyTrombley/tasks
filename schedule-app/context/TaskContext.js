import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  loadTasks,
  saveTasks,
  generateSchedule,
  addTask as addTaskUtil,
  removeTask as removeTaskUtil,
  addSubtask as addSubtaskUtil,
  removeSubtask as removeSubtaskUtil
} from '../utils/taskUtils';

// Action types
const ACTIONS = {
  LOAD_TASKS: 'LOAD_TASKS',
  ADD_TASK: 'ADD_TASK',
  REMOVE_TASK: 'REMOVE_TASK',
  ADD_SUBTASK: 'ADD_SUBTASK',
  REMOVE_SUBTASK: 'REMOVE_SUBTASK',
  GENERATE_SCHEDULE: 'GENERATE_SCHEDULE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  tasks: [],
  schedule: {},
  loading: false,
  error: null
};

// Reducer function
function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null
      };

    case ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: action.payload,
        error: null
      };

    case ACTIONS.REMOVE_TASK:
      return {
        ...state,
        tasks: action.payload,
        error: null
      };

    case ACTIONS.ADD_SUBTASK:
      return {
        ...state,
        tasks: action.payload,
        error: null
      };

    case ACTIONS.REMOVE_SUBTASK:
      return {
        ...state,
        tasks: action.payload,
        error: null
      };

    case ACTIONS.GENERATE_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        error: null
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
}

// Create context
const TaskContext = createContext();

// Custom hook to use the TaskContext
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

// TaskProvider component
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const tasks = loadTasks();
      dispatch({ type: ACTIONS.LOAD_TASKS, payload: tasks });
      
      // Generate initial schedule if tasks exist
      if (tasks.length > 0) {
        const schedule = generateSchedule(tasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: schedule });
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load tasks' });
    }
  }, []);

  // Action creators
  const actions = {
    // Add a new task
    addTask: (taskText) => {
      try {
        if (!taskText || typeof taskText !== 'string' || !taskText.trim()) {
          throw new Error('Task text must be a non-empty string');
        }

        const updatedTasks = addTaskUtil(state.tasks, taskText);
        saveTasks(updatedTasks);
        dispatch({ type: ACTIONS.ADD_TASK, payload: updatedTasks });

        // Regenerate schedule with new tasks
        const newSchedule = generateSchedule(updatedTasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: newSchedule });

        return { success: true };
      } catch (error) {
        console.error('Error adding task:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    // Remove a task
    removeTask: (taskIndex) => {
      try {
        if (taskIndex < 0 || taskIndex >= state.tasks.length) {
          throw new Error('Invalid task index');
        }

        const updatedTasks = removeTaskUtil(state.tasks, taskIndex);
        saveTasks(updatedTasks);
        dispatch({ type: ACTIONS.REMOVE_TASK, payload: updatedTasks });

        // Regenerate schedule with remaining tasks
        const newSchedule = generateSchedule(updatedTasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: newSchedule });

        return { success: true };
      } catch (error) {
        console.error('Error removing task:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    // Add a subtask to an existing task
    addSubtask: (taskIndex, subtaskText) => {
      try {
        if (taskIndex < 0 || taskIndex >= state.tasks.length) {
          throw new Error('Invalid task index');
        }

        if (!subtaskText || typeof subtaskText !== 'string' || !subtaskText.trim()) {
          throw new Error('Subtask text must be a non-empty string');
        }

        const updatedTasks = addSubtaskUtil(state.tasks, taskIndex, subtaskText);
        saveTasks(updatedTasks);
        dispatch({ type: ACTIONS.ADD_SUBTASK, payload: updatedTasks });

        // Regenerate schedule to reflect subtask changes
        const newSchedule = generateSchedule(updatedTasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: newSchedule });

        return { success: true };
      } catch (error) {
        console.error('Error adding subtask:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    // Remove a subtask from a task
    removeSubtask: (taskIndex, subtaskIndex) => {
      try {
        if (taskIndex < 0 || taskIndex >= state.tasks.length) {
          throw new Error('Invalid task index');
        }

        const task = state.tasks[taskIndex];
        if (subtaskIndex < 0 || subtaskIndex >= task.subtasks.length) {
          throw new Error('Invalid subtask index');
        }

        const updatedTasks = removeSubtaskUtil(state.tasks, taskIndex, subtaskIndex);
        saveTasks(updatedTasks);
        dispatch({ type: ACTIONS.REMOVE_SUBTASK, payload: updatedTasks });

        // Regenerate schedule to reflect subtask changes
        const newSchedule = generateSchedule(updatedTasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: newSchedule });

        return { success: true };
      } catch (error) {
        console.error('Error removing subtask:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    // Generate a new random schedule
    generateNewSchedule: () => {
      try {
        const newSchedule = generateSchedule(state.tasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: newSchedule });
        return { success: true };
      } catch (error) {
        console.error('Error generating schedule:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to generate schedule' });
        return { success: false, error: error.message };
      }
    },

    // Clear error state
    clearError: () => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    },

    // Reload tasks from localStorage
    reloadTasks: () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const tasks = loadTasks();
        dispatch({ type: ACTIONS.LOAD_TASKS, payload: tasks });
        
        // Regenerate schedule with reloaded tasks
        const schedule = generateSchedule(tasks);
        dispatch({ type: ACTIONS.GENERATE_SCHEDULE, payload: schedule });

        return { success: true };
      } catch (error) {
        console.error('Error reloading tasks:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to reload tasks' });
        return { success: false, error: error.message };
      }
    }
  };

  // Context value
  const contextValue = {
    // State
    tasks: state.tasks,
    schedule: state.schedule,
    loading: state.loading,
    error: state.error,
    
    // Actions
    ...actions,
    
    // Computed values
    hasSchedule: Object.keys(state.schedule).length > 0,
    taskCount: state.tasks.length,
    totalSubtasks: state.tasks.reduce((total, task) => total + (task.subtasks?.length || 0), 0)
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export default TaskContext;
