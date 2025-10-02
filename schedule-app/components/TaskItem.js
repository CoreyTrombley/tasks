import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Chip,
  Collapse,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Task as TaskIcon
} from '@mui/icons-material';

const TaskItem = ({ 
  task, 
  taskIndex, 
  onRemoveTask, 
  onAddSubtask, 
  onRemoveSubtask,
  showActions = true,
  compact = false 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleAddSubtask = () => {
    setShowSubtaskForm(true);
  };

  const handleRemoveTask = () => {
    if (onRemoveTask) {
      onRemoveTask(taskIndex);
    }
  };

  const handleRemoveSubtask = (subtaskIndex) => {
    if (onRemoveSubtask) {
      onRemoveSubtask(taskIndex, subtaskIndex);
    }
  };

  const subtaskCount = task.subtasks?.length || 0;

  return (
    <Card 
      sx={{ 
        mb: 2, 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ pb: compact ? 1 : 2 }}>
        {/* Task Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <TaskIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography 
              variant={compact ? "body1" : "h6"} 
              component="div" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                wordBreak: 'break-word'
              }}
            >
              {task.text}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {subtaskCount > 0 && (
              <Chip 
                label={`${subtaskCount} subtask${subtaskCount !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {showActions && (
              <>
                <Tooltip title="Add subtask">
                  <IconButton 
                    size="small" 
                    onClick={handleAddSubtask}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Delete task">
                  <IconButton 
                    size="small" 
                    onClick={handleRemoveTask}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {subtaskCount > 0 && (
              <Tooltip title={expanded ? "Collapse subtasks" : "Expand subtasks"}>
                <IconButton 
                  size="small" 
                  onClick={handleToggleExpanded}
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Subtasks Section */}
        {subtaskCount > 0 && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Subtasks:
            </Typography>
            <List dense sx={{ pl: 2 }}>
              {task.subtasks.map((subtask, subtaskIndex) => (
                <ListItem
                  key={subtaskIndex}
                  sx={{ 
                    pl: 0,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }
                  }}
                  secondaryAction={
                    showActions && (
                      <Tooltip title="Delete subtask">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveSubtask(subtaskIndex)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {subtaskIndex + 1}. {subtask.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}

        {/* Empty State for No Subtasks */}
        {subtaskCount === 0 && !compact && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
            No subtasks yet. Click the + button to add one.
          </Typography>
        )}
      </CardContent>

      {/* Subtask Form Modal/Inline would be handled by parent component */}
      {showSubtaskForm && onAddSubtask && (
        <Box sx={{ px: 2, pb: 2 }}>
          <SubtaskFormInline
            taskIndex={taskIndex}
            onAddSubtask={(subtaskText) => {
              onAddSubtask(taskIndex, subtaskText);
              setShowSubtaskForm(false);
            }}
            onCancel={() => setShowSubtaskForm(false)}
          />
        </Box>
      )}
    </Card>
  );
};

// Inline subtask form component
const SubtaskFormInline = ({ taskIndex, onAddSubtask, onCancel }) => {
  const [subtaskText, setSubtaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subtaskText.trim()) {
      onAddSubtask(subtaskText.trim());
      setSubtaskText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <input
        type="text"
        value={subtaskText}
        onChange={(e) => setSubtaskText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter subtask..."
        autoFocus
        style={{
          flex: 1,
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
      <IconButton 
        size="small" 
        onClick={handleSubmit}
        color="primary"
        disabled={!subtaskText.trim()}
      >
        <AddIcon />
      </IconButton>
      <IconButton 
        size="small" 
        onClick={onCancel}
      >
        <ExpandLessIcon />
      </IconButton>
    </Box>
  );
};

export default TaskItem;
