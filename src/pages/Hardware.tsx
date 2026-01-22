import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import Layout from '../components/layout/Layout';

const Hardware: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Hardware Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track hardware installations and warranties
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This feature is coming soon. Hardware tracking functionality will be available once the backend API is ready.
      </Alert>

      {/* Placeholder Table Structure */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Printer Serial No</TableCell>
                <TableCell>Install Date</TableCell>
                <TableCell>Warranty End Date</TableCell>
                <TableCell>Replacement Count</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ConstructionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Feature Coming Soon
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Hardware management will be available soon
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
};

export default Hardware;
