import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, ALLOWED_ROLES } from '../../utils/constants';
import { isRoleAllowed } from '../../utils/helpers';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if user has an allowed role
  if (!isRoleAllowed(user.role, ALLOWED_ROLES)) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
