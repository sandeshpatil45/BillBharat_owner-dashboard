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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { reportService } from '../services/report.service';
import type {
  SalesTeamData,
  ExecutivePerformance,
  ExecutiveDetail,
  BeltLevel,
  PerformanceStatus,
} from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';

// Fallback data for when API is not ready
const FALLBACK_DATA: SalesTeamData = {
  executives: [
    { id: '1', rank: 1, name: 'Amit S.', belt: '1B', visits: 892, demos: 142, sales: 22, revenue: 146000, avgPrice: 6636, status: 'on-track' },
    { id: '2', rank: 2, name: 'Priya K.', belt: '1A', visits: 845, demos: 128, sales: 19, revenue: 130000, avgPrice: 6842, status: 'on-track' },
    { id: '3', rank: 3, name: 'Rohit M.', belt: '2A', visits: 810, demos: 115, sales: 16, revenue: 104000, avgPrice: 6499, status: 'on-track' },
    { id: '4', rank: 4, name: 'Suresh', belt: '1C', visits: 780, demos: 98, sales: 13, revenue: 87400, avgPrice: 6723, status: 'on-track' },
    { id: '5', rank: 5, name: 'Karan D.', belt: '3A', visits: 720, demos: 85, sales: 10, revenue: 64900, avgPrice: 6499, status: 'below-target' },
    { id: '6', rank: 6, name: 'Deepak', belt: '2A', visits: 690, demos: 78, sales: 9, revenue: 53900, avgPrice: 5999, status: 'below-target' },
    { id: '7', rank: 7, name: 'Vishal', belt: '4', visits: 650, demos: 70, sales: 8, revenue: 51900, avgPrice: 6499, status: 'below-target' },
    { id: '8', rank: 8, name: 'Sachin', belt: '3B', visits: 620, demos: 62, sales: 7, revenue: 45400, avgPrice: 6499, status: 'below-target' },
    { id: '9', rank: 9, name: 'Ravi P.', belt: '5', visits: 540, demos: 48, sales: 4, revenue: 23900, avgPrice: 5999, status: 'critical' },
    { id: '10', rank: 10, name: 'Ajay', belt: '6', visits: 510, demos: 42, sales: 3, revenue: 19400, avgPrice: 6499, status: 'critical' },
  ],
  totals: {
    visits: 7457,
    demos: 868,
    sales: 111,
    revenue: 728000,
    avgPrice: 6559,
  },
  funnel: {
    totalVisits: 7457,
    totalDemos: 868,
    totalSales: 111,
    paperUpsell: 94,
    paperUpsellPercentage: 84.7,
    visitToDemoRate: 11.6,
    demoToSaleRate: 12.8,
    visitToDemoTarget: 12,
    demoToSaleTarget: 10,
    paperUpsellTarget: 100,
  },
};

const FALLBACK_EXECUTIVE_DETAIL: ExecutiveDetail = {
  id: '1',
  name: 'Amit S.',
  belt: '1B',
  checkInTime: '09:02 AM',
  checkOutTime: '07:15 PM',
  shopsVisitedToday: 38,
  demosToday: 6,
  salesToday: 2,
  paperDeliveriesToday: 1,
  couponsUsedToday: ['OFF1000', 'OFF1500'],
  couponPoolRemaining: 8,
  couponPoolTotal: 23,
  commissionEarned: 15400,
  bonusEarned: 3500,
  totalPayoutDue: 30900,
  gpsTrail: [],
};

const getStatusIcon = (status: PerformanceStatus) => {
  switch (status) {
    case 'on-track':
      return <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 20 }} />;
    case 'below-target':
      return <WarningIcon sx={{ color: '#eab308', fontSize: 20 }} />;
    case 'critical':
      return <ErrorIcon sx={{ color: '#dc2626', fontSize: 20 }} />;
  }
};

const getRankEmoji = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank.toString();
};

const SalesTeam: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [belt, setBelt] = useState('ALL');
  const [salesData, setSalesData] = useState<SalesTeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExec, setSelectedExec] = useState<ExecutiveDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchSalesTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportService.getSalesTeamData(period, belt);
      setSalesData(data);
    } catch {
      setSalesData(FALLBACK_DATA);
    } finally {
      setLoading(false);
    }
  }, [period, belt]);

  useEffect(() => {
    fetchSalesTeamData();
  }, [fetchSalesTeamData]);

  const handleExecutiveClick = async (execId: string) => {
    try {
      const detail = await reportService.getExecutiveDetail(execId);
      setSelectedExec(detail);
      setDialogOpen(true);
    } catch {
      setSelectedExec(FALLBACK_EXECUTIVE_DETAIL);
      setDialogOpen(true);
    }
  };

  if (loading && !salesData) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  const data = salesData!;
  const funnel = data.funnel;

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          👥 Sales Team Performance
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>📅 Period</InputLabel>
              <Select
                value={period}
                label="📅 Period"
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Belt Level</InputLabel>
              <Select
                value={belt}
                label="Belt Level"
                onChange={(e) => setBelt(e.target.value)}
              >
                <MenuItem value="ALL">All Belts</MenuItem>
                <MenuItem value="1A">Belt 1A</MenuItem>
                <MenuItem value="1B">Belt 1B</MenuItem>
                <MenuItem value="1C">Belt 1C</MenuItem>
                <MenuItem value="2A">Belt 2A</MenuItem>
                <MenuItem value="3A">Belt 3A</MenuItem>
                <MenuItem value="4">Belt 4</MenuItem>
                <MenuItem value="5">Belt 5</MenuItem>
                <MenuItem value="6">Belt 6</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Executive Scoreboard */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            🏆 Executive Scoreboard
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 60 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 60 }}>Belt</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Visits</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Demos</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Sales</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Revenue</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Avg Price</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 50, textAlign: 'center' }}>%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.executives.map((exec) => (
                <TableRow
                  key={exec.id}
                  hover
                  onClick={() => handleExecutiveClick(exec.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {exec.rank <= 3 ? (
                        <EmojiEventsIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                      ) : null}
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getRankEmoji(exec.rank)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {exec.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={exec.belt} size="small" sx={{ fontSize: 11 }} />
                  </TableCell>
                  <TableCell align="right">{formatNumber(exec.visits)}</TableCell>
                  <TableCell align="right">{formatNumber(exec.demos)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {exec.sales}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(exec.revenue)}</TableCell>
                  <TableCell align="right">{formatCurrency(exec.avgPrice)}</TableCell>
                  <TableCell align="center">{getStatusIcon(exec.status)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: '#f1f5f9', fontWeight: 700 }}>
                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>
                  TOTAL
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatNumber(data.totals.visits)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatNumber(data.totals.demos)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {data.totals.sales}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatCurrency(data.totals.revenue)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatCurrency(data.totals.avgPrice)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ px: 3, py: 2, background: '#fffbeb', display: 'flex', gap: 3, fontSize: 13 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
            <Typography variant="caption">On Track</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon sx={{ fontSize: 18, color: '#eab308' }} />
            <Typography variant="caption">Below Target</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon sx={{ fontSize: 18, color: '#dc2626' }} />
            <Typography variant="caption">Critical</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Conversion Funnel */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
          📊 Conversion Funnel
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Visits: {formatNumber(funnel.totalVisits)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                100%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 1 }} />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Demos: {formatNumber(funnel.totalDemos)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                {funnel.visitToDemoRate.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(funnel.totalDemos / funnel.totalVisits) * 100}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Sales: {formatNumber(funnel.totalSales)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                {((funnel.totalSales / funnel.totalVisits) * 100).toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(funnel.totalSales / funnel.totalVisits) * 100}
              color="success"
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Paper Upsell: {formatNumber(funnel.paperUpsell)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                {funnel.paperUpsellPercentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={funnel.paperUpsellPercentage}
              color="warning"
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Visit→Demo: <strong>{funnel.visitToDemoRate.toFixed(1)}%</strong> (Target:{' '}
                {funnel.visitToDemoTarget}%)
              </Typography>
              {funnel.visitToDemoRate < funnel.visitToDemoTarget ? (
                <Chip label="⚠️ Slightly low" size="small" color="warning" />
              ) : (
                <Chip label="✅ On track" size="small" color="success" />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Demo→Sale: <strong>{funnel.demoToSaleRate.toFixed(1)}%</strong> (Target:{' '}
                {funnel.demoToSaleTarget}%)
              </Typography>
              {funnel.demoToSaleRate >= funnel.demoToSaleTarget ? (
                <Chip label="✅ Above target" size="small" color="success" />
              ) : (
                <Chip label="⚠️ Below target" size="small" color="warning" />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Paper Upsell: <strong>{funnel.paperUpsellPercentage.toFixed(1)}%</strong> (Target:{' '}
                {funnel.paperUpsellTarget}%)
              </Typography>
              {funnel.paperUpsellPercentage < funnel.paperUpsellTarget ? (
                <Chip
                  label={`⚠️ ${funnel.totalSales - funnel.paperUpsell} missed!`}
                  size="small"
                  color="warning"
                />
              ) : (
                <Chip label="✅ Perfect" size="small" color="success" />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Executive Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedExec && (
          <>
            <DialogTitle sx={{ background: '#1e293b', color: '#fff', pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedExec.name}
                  </Typography>
                  <Chip
                    label={`Belt ${selectedExec.belt}`}
                    size="small"
                    sx={{ mt: 1, color: '#fff', borderColor: '#fff' }}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Today's Activity
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Check-in:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedExec.checkInTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Check-out:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedExec.checkOutTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          🏪 Shops Visited:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedExec.shopsVisitedToday}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          🎤 Demos:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedExec.demosToday}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          ✅ Sales:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedExec.salesToday}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          📦 Paper Deliveries:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedExec.paperDeliveriesToday}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Coupons & Inventory
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        🎫 Coupons Used Today:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        {selectedExec.couponsUsedToday.length > 0 ? (
                          selectedExec.couponsUsedToday.map((coupon, idx) => (
                            <Chip key={idx} label={coupon} size="small" color="primary" />
                          ))
                        ) : (
                          <Typography variant="body2">None</Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      📊 Coupon Pool Remaining:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedExec.couponPoolRemaining} of {selectedExec.couponPoolTotal}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      💰 This Month Earnings
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Commission:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#16a34a' }}>
                          {formatCurrency(selectedExec.commissionEarned)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Bonus:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#16a34a' }}>
                          {formatCurrency(selectedExec.bonusEarned)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Total Payout:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#047857' }}>
                          {formatCurrency(selectedExec.totalPayoutDue)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" fullWidth>
                      View Full History
                    </Button>
                    <Button variant="outlined" size="small" fullWidth>
                      View GPS Trail
                    </Button>
                    <Button variant="outlined" size="small" fullWidth>
                      View Sales List
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default SalesTeam;
