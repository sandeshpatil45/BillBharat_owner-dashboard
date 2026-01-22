import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Chip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const drawerWidth = 260;

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#ffffff',
        color: '#1e293b',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {/* Page title will be set by individual pages if needed */}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Chip
              label={user?.role || 'ADMIN'}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
          <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>
            {user?.name ? getInitials(user.name) : <AccountCircleIcon />}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
