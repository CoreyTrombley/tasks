import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TaskIcon from '@mui/icons-material/Task';

const Layout = ({ children, title = 'Task Scheduler' }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigation = (path) => {
    router.push(path);
  };

  const isCurrentPage = (path) => {
    return router.pathname === path;
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CalendarTodayIcon />
            {!isMobile && 'Task Scheduler'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/')}
              startIcon={<CalendarTodayIcon />}
              variant={isCurrentPage('/') ? 'outlined' : 'text'}
              sx={{
                borderColor: isCurrentPage('/') ? 'white' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {!isMobile && 'Schedule'}
            </Button>
            
            <Button
              color="inherit"
              onClick={() => handleNavigation('/tasks')}
              startIcon={<TaskIcon />}
              variant={isCurrentPage('/tasks') ? 'outlined' : 'text'}
              sx={{
                borderColor: isCurrentPage('/tasks') ? 'white' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {!isMobile && 'Tasks'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Task Scheduler - Organize your weekly tasks efficiently
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
