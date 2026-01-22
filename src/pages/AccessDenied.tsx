import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            You do not have permission to access this dashboard.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This dashboard is only accessible to OWNER, ADMIN, and COORDINATOR roles.
          </Typography>
          {user && (
            <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
              Current Role: <strong>{user.role}</strong>
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            size="large"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccessDenied;
