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
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { beltService } from '../services/belt.service';
import type {
  BeltPerformance,
  BeltSaturation,
  BeltStatus,
} from '../types';
import { formatNumber } from '../utils/helpers';

// Fallback data for when API is not ready
const FALLBACK_BELTS: BeltPerformance[] = [
  { beltId: '1', beltName: 'Nashik Urban', executiveCount: 3, merchantCount: 185, salesPerMonth: 54, status: 'peak' },
  { beltId: '2', beltName: 'Malegaon', executiveCount: 2, merchantCount: 82, salesPerMonth: 25, status: 'growing' },
  { beltId: '3', beltName: 'Sinnar/Igatpuri', executiveCount: 2, merchantCount: 48, salesPerMonth: 15, status: 'new' },
  { beltId: '4', beltName: 'Manmad/Yeola', executiveCount: 1, merchantCount: 30, salesPerMonth: 8, status: 'new' },
  { beltId: '5', beltName: 'Niphad/Lasalgaon', executiveCount: 1, merchantCount: 20, salesPerMonth: 5, status: 'new' },
  { beltId: '6', beltName: 'Trimbakeshwar', executiveCount: 1, merchantCount: 15, salesPerMonth: 4, status: 'new' },
];

const FALLBACK_SATURATION: BeltSaturation[] = [
  { beltId: '1', beltName: 'Nashik Urban', merchantsAcquired: 185, totalAddressable: 237, saturationPercentage: 78 },
  { beltId: '2', beltName: 'Malegaon', merchantsAcquired: 82, totalAddressable: 158, saturationPercentage: 52 },
  { beltId: '3', beltName: 'Sinnar/Igatpuri', merchantsAcquired: 48, totalAddressable: 171, saturationPercentage: 28 },
  { beltId: '4', beltName: 'Manmad/Yeola', merchantsAcquired: 30, totalAddressable: 167, saturationPercentage: 18 },
  { beltId: '5', beltName: 'Niphad/Lasalgaon', merchantsAcquired: 20, totalAddressable: 167, saturationPercentage: 12 },
  { beltId: '6', beltName: 'Trimbakeshwar', merchantsAcquired: 15, totalAddressable: 188, saturationPercentage: 8 },
];

const FALLBACK_TOTALS = {
  executives: 10,
  merchants: 380,
  salesPerMonth: 111,
};

const getStatusChip = (status: BeltStatus) => {
  switch (status) {
    case 'peak':
      return <Chip label="🟢 Peak" size="small" sx={{ background: '#dcfce7', color: '#16a34a', fontWeight: 700 }} />;
    case 'growing':
      return <Chip label="🟢 Grow" size="small" sx={{ background: '#dcfce7', color: '#16a34a', fontWeight: 700 }} />;
    case 'new':
      return <Chip label="🟡 New" size="small" sx={{ background: '#fef3c7', color: '#92400e', fontWeight: 700 }} />;
    case 'inactive':
      return <Chip label="🔴 Inactive" size="small" sx={{ background: '#fee2e2', color: '#dc2626', fontWeight: 700 }} />;
  }
};

const BeltTerritoryView: React.FC = () => {
  const [belts, setBelts] = useState<BeltPerformance[]>([]);
  const [saturation, setSaturation] = useState<BeltSaturation[]>([]);
  const [totals, setTotals] = useState(FALLBACK_TOTALS);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await beltService.getBeltTerritoryData();
      setBelts(data.belts);
      setSaturation(data.saturation);
      setTotals(data.totals);
    } catch {
      setBelts(FALLBACK_BELTS);
      setSaturation(FALLBACK_SATURATION);
      setTotals(FALLBACK_TOTALS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && belts.length === 0) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          🗺️ Belt & Territory Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Geographical distribution and belt performance analysis
        </Typography>
      </Box>

      {/* Belt Performance Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Belt Performance Summary
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Belt</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Execs</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Merchants</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Sales/Mo</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {belts.map((belt) => (
                <TableRow key={belt.beltId} hover>
                  <TableCell>
                    <Chip
                      label={belt.beltId}
                      size="small"
                      sx={{ fontWeight: 700, background: '#eff6ff', color: '#1e40af' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {belt.beltName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
                    {belt.executiveCount}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatNumber(belt.merchantCount)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatNumber(belt.salesPerMonth)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{getStatusChip(belt.status)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ background: '#1e293b' }}>
                <TableCell colSpan={2} sx={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  TOTAL
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {totals.executives}
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatNumber(totals.merchants)}
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatNumber(totals.salesPerMonth)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Interactive Map */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MapIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Interactive Territory Map
          </Typography>
        </Box>

        {/* Map Placeholder */}
        <Box
          sx={{
            height: 500,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px dashed #94a3b8',
            mb: 2,
          }}
        >
          <MapIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#64748b', mb: 1, fontWeight: 700 }}>
            Google Maps Integration
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
            Belt boundaries and merchant locations will appear here
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', maxWidth: 600 }}>
            Click any dot → See merchant details | Click any salesman → See today's trail
          </Typography>
        </Box>

        {/* Legend */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, background: '#f8fafc', borderRadius: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#16a34a' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Active Merchants
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, background: '#f8fafc', borderRadius: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#3b82f6' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Salesman GPS (Live)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, background: '#f8fafc', borderRadius: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#eab308' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Visited Today (No Sale)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, background: '#f8fafc', borderRadius: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#dc2626' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Inactive (Churn Risk)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Belt Boundaries:</strong> Colored zones will show territory assignments on the map.
            Route trails display each salesman's daily movement pattern.
          </Typography>
        </Alert>
      </Paper>

      {/* Belt Saturation Meter */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TimelineIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Belt Saturation Meter
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {saturation.map((belt) => (
            <Box key={belt.beltId}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`Belt ${belt.beltId}`}
                    size="small"
                    sx={{ fontWeight: 700, background: '#eff6ff', color: '#1e40af', minWidth: 70 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {belt.beltName}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {belt.saturationPercentage}% Saturated
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={belt.saturationPercentage}
                  sx={{
                    flex: 1,
                    height: 24,
                    borderRadius: 2,
                    background: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      background:
                        belt.saturationPercentage >= 70
                          ? 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)'
                          : belt.saturationPercentage >= 40
                          ? 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)'
                          : 'linear-gradient(90deg, #eab308 0%, #ca8a04 100%)',
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ minWidth: 100, textAlign: 'right', color: '#64748b' }}>
                  {formatNumber(belt.merchantsAcquired)} / {formatNumber(belt.totalAddressable)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Saturation Formula:</strong> Merchants Acquired ÷ Total Addressable Market in Belt
          </Typography>
        </Alert>
      </Paper>
    </Layout>
  );
};

export default BeltTerritoryView;
