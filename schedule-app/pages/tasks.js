import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Fab,
  Snackbar,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  TaskAlt as TaskAltIcon
} from '@mui/icons-material';

// Import our custom components
import Layout from '../components/Layout';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import SubtaskForm from '../components/SubtaskForm';
import { TaskDeleteDialog } from '../components/ConfirmDialog';

// Import context
import { useTaskContext } from '../context/TaskContext';

const TasksPage = () => {
  // Context state and actions
  const {
    tasks,
    loading,
    error,
    taskCount,
    totalSubtasks,
    addTask,
    removeTask,
    addSubtask,
    removeSubtask,
    reloadTasks,
    clearError
  } = useTaskContext();

  // Local state for UI
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Handle adding a new task
  const handleAddTask = (taskText) => {
    const result = addTask(taskText);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Task added successfully!',
        severity: 'success'
      });
      return { success: true };
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to add task',
        severity: 'error'
      });
      return { success: false, error: result.error };
    }
  };

  // Handle adding a subtask
  const handleAddSubtask = (taskIndex, subtaskText) => {
    const result = addSubtask(taskIndex, subtaskText);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Subtask added successfully!',
        severity: 'success'
      });
      return { success: true };
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to add subtask',
        severity: 'error'
      });
      return { success: false, error: result.error };
    }
  };

  // Handle removing a task
  const handleRemoveTask = (taskIndex) => {
    setTaskToDelete({ index: taskIndex, task: tasks[taskIndex] });
    setShowDeleteDialog(true);
  };

  // Confirm task deletion
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const result = removeTask(taskToDelete.index);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Task deleted successfully!',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'Failed to delete task',
          severity: 'error'
        });
      }
    }
    setShowDeleteDialog(false);
    setTaskToDelete(null);
  };

  // Handle removing a subtask
  const handleRemoveSubtask = (taskIndex, subtaskIndex) => {
    const result = removeSubtask(taskIndex, subtaskIndex);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Subtask removed successfully!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to remove subtask',
        severity: 'error'
      });
    }
  };

  // Handle opening subtask form
  const handleOpenSubtaskForm = (taskIndex) => {
    setSelectedTaskForSubtask({
      index: taskIndex,
      task: tasks[taskIndex]
    });
    setShowSubtaskForm(true);
  };

  // Handle closing subtask form
  const handleCloseSubtaskForm = () => {
    setShowSubtaskForm(false);
    setSelectedTaskForSubtask(null);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    if (error) {
      clearError();
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    const result = reloadTasks();
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Tasks refreshed successfully!',
        severity: 'success'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Task Management - Task Scheduler</title>
        <meta name="description" content="Manage your tasks and subtasks for weekly scheduling" />
      </Head>

      <Layout title="Task Management">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Add and manage your tasks here. Tasks will be randomly distributed across your weekly schedule.
              </Typography>
              
              {/* Task Statistics */}
              <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TaskAltIcon color="primary" />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" color="primary.main">
                      {taskCount} Task{taskCount !== 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalSubtasks} Total Subtask{totalSubtasks !== 1 ? 's' : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{ flex: { xs: 1, md: 'none' } }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowTaskForm(true)}
                  disabled={loading}
                  sx={{ flex: { xs: 1, md: 'none' } }}
                >
                  Add Task
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Tasks List */}
        {!loading && (
          <>
            {taskCount === 0 ? (
              // Empty State
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <TaskAltIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No tasks yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Get started by adding your first task. Tasks will be randomly assigned to your weekly schedule.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setShowTaskForm(true)}
                >
                  Add Your First Task
                </Button>
              </Paper>
            ) : (
              // Tasks Grid
              <Grid container spacing={3}>
                {tasks.map((task, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <TaskItem
                      task={task}
                      taskIndex={index}
                      onRemoveTask={handleRemoveTask}
                      onAddSubtask={handleOpenSubtaskForm}
                      onRemoveSubtask={handleRemoveSubtask}
                      showActions={true}
                      compact={false}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Floating Action Button for Mobile */}
        <Fab
          color="primary"
          aria-label="add task"
          onClick={() => setShowTaskForm(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' }
          }}
        >
          <AddIcon />
        </Fab>

        {/* Task Form Dialog */}
        <TaskForm
          open={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleAddTask}
          loading={loading}
          error={null}
        />

        {/* Subtask Form Dialog */}
        <SubtaskForm
          open={showSubtaskForm}
          onClose={handleCloseSubtaskForm}
          onSubmit={handleAddSubtask}
          taskText={selectedTaskForSubtask?.task?.text || ''}
          taskIndex={selectedTaskForSubtask?.index}
          loading={loading}
          error={null}
        />

        {/* Delete Confirmation Dialog */}
        <TaskDeleteDialog
          open={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setTaskToDelete(null);
          }}
          onConfirm={confirmDeleteTask}
          task={taskToDelete?.task}
          loading={loading}
          error={null}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Layout>
    </>
  );
};

export default TasksPage;
