import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container>
        <Toolbar disableGutters>
          <FeedbackIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
            Feedback System
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              variant={location.pathname === '/' ? 'contained' : 'text'}
            >
              Submit Feedback
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="primary"
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => navigate('/feedbacks')}
                  variant={location.pathname === '/feedbacks' ? 'contained' : 'text'}
                >
                  Admin Panel
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              location.pathname !== '/login' && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate('/login')}
                >
                  Admin Login
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
