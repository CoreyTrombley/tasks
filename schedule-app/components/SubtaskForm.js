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
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon,
  Task as TaskIcon 
} from '@mui/icons-material';

const SubtaskForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  taskText = '',
  taskIndex = null,
  loading = false,
  error = null 
}) => {
  const [subtaskText, setSubtaskText] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any previous local errors
    setLocalError('');
    
    // Validate input
    if (!subtaskText.trim()) {
      setLocalError('Subtask text cannot be empty');
      return;
    }

    if (subtaskText.trim().length > 150) {
      setLocalError('Subtask text must be less than 150 characters');
      return;
    }

    // Call the onSubmit callback
    if (onSubmit && taskIndex !== null) {
      const result = onSubmit(taskIndex, subtaskText.trim());
      
      // If submission was successful, clear the form and close
      if (result && result.success !== false) {
        setSubtaskText('');
        setLocalError('');
        onClose();
      }
    }
  };

  const handleClose = () => {
    setSubtaskText('');
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
            Add Subtask
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          {/* Show parent task */}
          {taskText && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Adding subtask to:
              </Typography>
              <Chip
                icon={<TaskIcon />}
                label={taskText}
                variant="outlined"
                color="primary"
                sx={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    padding: '8px 12px'
                  }
                }}
              />
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a subtask that breaks down the main task into smaller, actionable steps.
          </Typography>

          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {displayError}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Subtask Description"
            placeholder="e.g., Research best practices"
            value={subtaskText}
            onChange={(e) => setSubtaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            rows={2}
            variant="outlined"
            helperText={`${subtaskText.length}/150 characters`}
            error={subtaskText.length > 150}
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
            disabled={loading || !subtaskText.trim() || subtaskText.length > 150}
            startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{
              minWidth: 140,
            }}
          >
            {loading ? 'Adding...' : 'Add Subtask'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Inline version for use within other components
export const SubtaskFormInline = ({ 
  onSubmit, 
  onCancel, 
  taskIndex,
  loading = false,
  error = null,
  placeholder = "Enter subtask..."
}) => {
  const [subtaskText, setSubtaskText] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLocalError('');
    
    if (!subtaskText.trim()) {
      setLocalError('Subtask text cannot be empty');
      return;
    }

    if (subtaskText.trim().length > 150) {
      setLocalError('Subtask text must be less than 150 characters');
      return;
    }

    if (onSubmit && taskIndex !== null) {
      const result = onSubmit(taskIndex, subtaskText.trim());
      if (result && result.success !== false) {
        setSubtaskText('');
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
            value={subtaskText}
            onChange={(e) => setSubtaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={2}
            variant="outlined"
            helperText={subtaskText.length > 130 ? `${subtaskText.length}/150 characters` : ''}
            error={subtaskText.length > 150}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={loading || !subtaskText.trim() || subtaskText.length > 150}
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

export default SubtaskForm;
