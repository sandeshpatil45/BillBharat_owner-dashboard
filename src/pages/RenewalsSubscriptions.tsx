import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { renewalService } from '../services/renewal.service';
import type { RenewalData, RenewalPipeline, RenewalAction } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';

// Fallback data for when API is not ready
const FALLBACK_PIPELINE: RenewalPipeline = {
  totalActiveMerchants: 380,
  periods: [
    { period: 'Next 30 days', merchantCount: 0, potentialRevenue: 0 },
    { period: '31-90 days', merchantCount: 12, potentialRevenue: 23988 },
    { period: '91-180 days', merchantCount: 45, potentialRevenue: 89955 },
    { period: '181-365 days', merchantCount: 323, potentialRevenue: 645677 },
  ],
  totalPotentialRevenue: 759620,
  expectedRenewalRate: {
    min: 65,
    max: 75,
  },
  expectedRevenue: {
    min: 493753,
    max: 569715,
  },
};

const FALLBACK_ACTIONS: RenewalAction[] = [
  {
    trigger: '60 days before expiry',
    method: '📱 WhatsApp',
    description: 'Aapka BillBharat subscription 60 din mein expire hoga. ₹1,999 mein renew karein.',
  },
  {
    trigger: '30 days before expiry',
    method: '📱 WhatsApp + 📞 Call',
    description: 'WhatsApp reminder plus call from helpline',
  },
  {
    trigger: '7 days before expiry',
    method: '🏃 Salesman Visit',
    description: 'In-person visit for renewal collection',
  },
];

const RenewalsSubscriptions: React.FC = () => {
  const [pipeline, setPipeline] = useState<RenewalPipeline | null>(null);
  const [actions, setActions] = useState<RenewalAction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await renewalService.getRenewalData();
      setPipeline(data.pipeline);
      setActions(data.actions);
    } catch {
      setPipeline(FALLBACK_PIPELINE);
      setActions(FALLBACK_ACTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfigureReminders = () => {
    // Navigate to settings or open dialog
    alert('Renewal reminder configuration coming soon!');
  };

  if (loading && !pipeline) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  const pipelineData = pipeline!;

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          🔄 Renewals & Subscriptions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage subscription renewals and revenue projections
        </Typography>
      </Box>

      {/* Current Status */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>YEAR 1 (Currently Free):</strong> All {formatNumber(pipelineData.totalActiveMerchants)} active merchants are on Free Year 1 License
        </Typography>
      </Alert>

      {/* Renewal Pipeline */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AutorenewIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Renewal Pipeline
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Merchants</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Potential Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pipelineData.periods.map((period, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {period.period}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatNumber(period.merchantCount)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatCurrency(period.potentialRevenue)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ background: '#1e293b' }}>
                <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  TOTAL
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatNumber(pipelineData.totalActiveMerchants)}
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatCurrency(pipelineData.totalPotentialRevenue)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'right', color: '#64748b' }}>
          (if 100% renew)
        </Typography>
      </Paper>

      {/* Expected Renewal Revenue */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AttachMoneyIcon sx={{ color: '#16a34a', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Expected Renewal Revenue
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: '#ffffff' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Expected Renewal Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {pipelineData.expectedRenewalRate.min}% - {pipelineData.expectedRenewalRate.max}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#fff',
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: '#dcfce7', mb: 1 }}>
                  Expected Renewal Revenue Range
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(pipelineData.expectedRevenue.min)} -{' '}
                  {formatCurrency(pipelineData.expectedRevenue.max)}
                </Typography>
                <Alert severity="success" sx={{ mt: 2, background: 'rgba(255,255,255,0.2)' }}>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                    💰 This is almost PURE profit (no hardware cost!)
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Renewal Actions */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActiveIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Renewal Actions (Auto-Trigger)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={handleConfigureReminders}
            sx={{ fontWeight: 700 }}
          >
            ⚙️ Configure Reminders
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {actions.map((action, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                borderLeft: '4px solid #3b82f6',
                background: '#f8fafc',
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Trigger:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {action.trigger}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Method:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {action.method}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Description:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {action.description}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Layout>
  );
};

export default RenewalsSubscriptions;
