import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning', // 'warning', 'error', 'info'
  loading = false,
  error = null,
  itemDetails = null // For showing what's being deleted
}) => {
  const handleConfirm = () => {
    if (onConfirm && !loading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'error':
        return <DeleteIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'warning';
    }
  };

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
          {getSeverityIcon()}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {itemDetails && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 2
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Item to be deleted:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {itemDetails.text}
            </Typography>
            {itemDetails.subtasks && itemDetails.subtasks.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This will also delete {itemDetails.subtasks.length} subtask{itemDetails.subtasks.length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        )}

        {severity === 'error' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>This action cannot be undone.</strong> Make sure you really want to proceed.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<CloseIcon />}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={getSeverityColor()}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          sx={{
            minWidth: 120,
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Specialized version for task deletion
export const TaskDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  task = null,
  loading = false,
  error = null
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone."
      confirmText="Delete Task"
      cancelText="Cancel"
      severity="error"
      loading={loading}
      error={error}
      itemDetails={task}
    />
  );
};

// Specialized version for subtask deletion
export const SubtaskDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  subtask = null,
  parentTask = null,
  loading = false,
  error = null
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Subtask"
      message={`Are you sure you want to delete this subtask${parentTask ? ` from "${parentTask.text}"` : ''}?`}
      confirmText="Delete Subtask"
      cancelText="Cancel"
      severity="warning"
      loading={loading}
      error={error}
      itemDetails={subtask ? { text: subtask.text } : null}
    />
  );
};

// Specialized version for schedule regeneration
export const ScheduleRegenerateDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  error = null
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Generate New Schedule"
      message="This will create a new random schedule, replacing your current one. Your tasks will remain the same, but they'll be redistributed across the week."
      confirmText="Generate New Schedule"
      cancelText="Cancel"
      severity="info"
      loading={loading}
      error={error}
    />
  );
};

export default ConfirmDialog;
