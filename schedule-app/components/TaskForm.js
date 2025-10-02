import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const TaskForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading = false,
  error = null 
}) => {
  const [taskText, setTaskText] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any previous local errors
    setLocalError('');
    
    // Validate input
    if (!taskText.trim()) {
      setLocalError('Task text cannot be empty');
      return;
    }

    if (taskText.trim().length > 200) {
      setLocalError('Task text must be less than 200 characters');
      return;
    }

    // Call the onSubmit callback
    if (onSubmit) {
      const result = onSubmit(taskText.trim());
      
      // If submission was successful, clear the form and close
      if (result && result.success !== false) {
        setTaskText('');
        setLocalError('');
        onClose();
      }
    }
  };

  const handleClose = () => {
    setTaskText('');
    setLocalError('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const displayError = error || localError;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon color="primary" />
          <Typography variant="h6" component="span">
            Add New Task
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a task that you'd like to add to your weekly schedule. You can add subtasks later.
          </Typography>

          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {displayError}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Task Description"
            placeholder="e.g., Review project documentation"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            rows={3}
            variant="outlined"
            helperText={`${taskText.length}/200 characters`}
            error={taskText.length > 200}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !taskText.trim() || taskText.length > 200}
            startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{
              minWidth: 120,
            }}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Inline version for use within other components
export const TaskFormInline = ({ 
  onSubmit, 
  onCancel, 
  loading = false,
  error = null,
  placeholder = "Enter new task..."
}) => {
  const [taskText, setTaskText] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLocalError('');
    
    if (!taskText.trim()) {
      setLocalError('Task text cannot be empty');
      return;
    }

    if (taskText.trim().length > 200) {
      setLocalError('Task text must be less than 200 characters');
      return;
    }

    if (onSubmit) {
      const result = onSubmit(taskText.trim());
      if (result && result.success !== false) {
        setTaskText('');
        setLocalError('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onCancel && onCancel();
    }
  };

  const displayError = error || localError;

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
      {displayError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {displayError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={3}
            variant="outlined"
            helperText={taskText.length > 180 ? `${taskText.length}/200 characters` : ''}
            error={taskText.length > 200}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={loading || !taskText.trim() || taskText.length > 200}
              startIcon={loading ? <CircularProgress size={14} /> : <AddIcon />}
              sx={{ minWidth: 80 }}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
            {onCancel && (
              <Button
                size="small"
                onClick={onCancel}
                disabled={loading}
                startIcon={<CloseIcon />}
                sx={{ minWidth: 80 }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default TaskForm;
