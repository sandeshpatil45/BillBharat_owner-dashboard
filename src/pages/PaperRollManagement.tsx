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
  Button,
  Card,
  CardContent,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WarningIcon from '@mui/icons-material/Warning';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { paperRollService } from '../services/paper-roll.service';
import type {
  PaperInventoryStats,
  PaperRevenueData,
  MerchantReorderPrediction,
  ReorderUrgency,
} from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';

// Fallback data for when API is not ready
const FALLBACK_INVENTORY: PaperInventoryStats = {
  locations: [
    { location: 'Central Hub', rolls: 600, boxes: 12, valueCost: 4800, type: 'hub' },
    { location: 'TL Home', rolls: 250, boxes: 5, valueCost: 2000, type: 'lead' },
    { location: 'Exec #1 (Bike)', execId: '1', execName: 'Rahul', rolls: 40, boxes: 0, valueCost: 320, type: 'exec' },
    { location: 'Exec #2 (Bike)', execId: '2', execName: 'Amit', rolls: 35, boxes: 0, valueCost: 280, type: 'exec' },
    { location: 'Exec #3 (Bike)', execId: '3', execName: 'Vijay', rolls: 50, boxes: 1, valueCost: 400, type: 'exec' },
    { location: 'Exec #4 (Bike)', execId: '4', execName: 'Suresh', rolls: 30, boxes: 0, valueCost: 240, type: 'exec' },
    { location: 'Exec #5 (Bike)', execId: '5', execName: 'Prakash', rolls: 25, boxes: 0, valueCost: 200, type: 'exec' },
    { location: 'Exec #6 (Bike)', execId: '6', execName: 'Manoj', rolls: 30, boxes: 0, valueCost: 240, type: 'exec' },
    { location: 'Exec #7 (Bike)', execId: '7', execName: 'Deepak', rolls: 20, boxes: 0, valueCost: 160, type: 'exec' },
    { location: 'Exec #8 (Bike)', execId: '8', execName: 'Ravi', rolls: 15, boxes: 0, valueCost: 120, type: 'exec' },
    { location: 'Exec #9 (Bike)', execId: '9', execName: 'Sandeep', rolls: 20, boxes: 0, valueCost: 160, type: 'exec' },
    { location: 'Exec #10 (Bike)', execId: '10', execName: 'Kiran', rolls: 10, boxes: 0, valueCost: 80, type: 'exec' },
  ],
  totalRolls: 1125,
  totalBoxes: 22,
  totalValue: 9000,
  dailyConsumptionRate: 85,
  daysOfStockLeft: 13,
  reorderThreshold: 500,
};

const FALLBACK_REVENUE: PaperRevenueData = {
  thisMonth: {
    boxesSold: 43,
    revenue: 38700,
    cost: 17200,
    profit: 21500,
    margin: 55.6,
  },
  lifetime: {
    revenue: 182700,
    profit: 101300,
  },
};

const FALLBACK_PREDICTIONS: MerchantReorderPrediction[] = [
  { merchantId: 'M0002', merchantName: 'Raj Hotel', estimatedRollsLeft: 3, reorderInDays: 0, urgency: 'urgent' },
  { merchantId: 'M0001', merchantName: 'Sharma Bakery', estimatedRollsLeft: 12, reorderInDays: 5, urgency: 'soon' },
  { merchantId: 'M0005', merchantName: 'Highway Dhaba', estimatedRollsLeft: 8, reorderInDays: 3, urgency: 'urgent' },
  { merchantId: 'M0008', merchantName: 'Fast Food Corner', estimatedRollsLeft: 22, reorderInDays: 12, urgency: 'ok' },
  { merchantId: 'M0015', merchantName: 'Krishna Medical', estimatedRollsLeft: 30, reorderInDays: 18, urgency: 'ok' },
  { merchantId: 'M0022', merchantName: 'New Fashion Store', estimatedRollsLeft: 6, reorderInDays: 2, urgency: 'urgent' },
  { merchantId: 'M0011', merchantName: 'Ganesh Kirana', estimatedRollsLeft: 15, reorderInDays: 7, urgency: 'soon' },
  { merchantId: 'M0033', merchantName: 'Sai Restaurant', estimatedRollsLeft: 4, reorderInDays: 1, urgency: 'urgent' },
];

const getUrgencyColor = (urgency: ReorderUrgency) => {
  switch (urgency) {
    case 'urgent':
      return '#dc2626';
    case 'soon':
      return '#eab308';
    case 'ok':
      return '#16a34a';
  }
};

const getUrgencyIcon = (urgency: ReorderUrgency) => {
  switch (urgency) {
    case 'urgent':
      return '🔴';
    case 'soon':
      return '🟡';
    case 'ok':
      return '🟢';
  }
};

const getReorderLabel = (days: number) => {
  if (days === 0) return 'TODAY!';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
};

const PaperRollManagement: React.FC = () => {
  const [inventory, setInventory] = useState<PaperInventoryStats | null>(null);
  const [revenue, setRevenue] = useState<PaperRevenueData | null>(null);
  const [predictions, setPredictions] = useState<MerchantReorderPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paperRollService.getPaperRollData();
      setInventory(data.inventory);
      setRevenue(data.revenue);
      setPredictions(data.reorderPredictions);
    } catch {
      setInventory(FALLBACK_INVENTORY);
      setRevenue(FALLBACK_REVENUE);
      setPredictions(FALLBACK_PREDICTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBulkWhatsApp = async () => {
    const urgentMerchants = predictions
      .filter((p) => p.urgency === 'urgent')
      .map((p) => p.merchantId);

    if (urgentMerchants.length === 0) {
      alert('No urgent reorders at this time.');
      return;
    }

    if (window.confirm(`Send WhatsApp to ${urgentMerchants.length} merchants with urgent reorder needs?`)) {
      try {
        const result = await paperRollService.sendBulkWhatsApp(urgentMerchants);
        alert(`✅ WhatsApp sent to ${result.sent} merchants successfully!`);
      } catch (error: any) {
        alert(error.message || 'Failed to send WhatsApp messages');
      }
    }
  };

  if (loading && !inventory) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  const inventoryData = inventory!;
  const revenueData = revenue!;
  const urgentCount = predictions.filter((p) => p.urgency === 'urgent').length;

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          📦 Paper Roll Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track inventory, revenue, and automated reorder predictions
        </Typography>
      </Box>

      {/* Inventory Status */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <InventoryIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Inventory Status
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Rolls</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Boxes</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Value (Cost)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryData.locations.map((loc, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    background: loc.type === 'hub' ? '#f0fdf4' : '#ffffff',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: loc.type === 'hub' ? 700 : 500 }}>
                      {loc.location}
                      {loc.execName && (
                        <Typography component="span" variant="caption" sx={{ color: '#64748b', ml: 1 }}>
                          ({loc.execName})
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatNumber(loc.rolls)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {loc.boxes > 0 ? formatNumber(loc.boxes) : '—'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                    {formatCurrency(loc.valueCost)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ background: '#1e293b' }}>
                <TableCell sx={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  TOTAL IN SYSTEM
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatNumber(inventoryData.totalRolls)}
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatNumber(inventoryData.totalBoxes)}
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: 15 }}>
                  {formatCurrency(inventoryData.totalValue)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ background: '#f8fafc' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Daily Consumption Rate
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  ~{inventoryData.dailyConsumptionRate} rolls/day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ background: '#f8fafc' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Days of Stock Left
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  ~{inventoryData.daysOfStockLeft} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                background:
                  inventoryData.totalRolls < inventoryData.reorderThreshold
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                    : '#f0fdf4',
                border:
                  inventoryData.totalRolls < inventoryData.reorderThreshold
                    ? '2px solid #f59e0b'
                    : '1px solid #86efac',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {inventoryData.totalRolls < inventoryData.reorderThreshold && (
                    <WarningIcon sx={{ color: '#f59e0b' }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Reorder Alert
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mt: 1 }}>
                  {inventoryData.totalRolls < inventoryData.reorderThreshold
                    ? `⚠️ Stock < ${inventoryData.reorderThreshold} rolls`
                    : `✅ Stock healthy`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Paper Roll Revenue */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AttachMoneyIcon sx={{ color: '#16a34a', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Paper Roll Revenue
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: '#ffffff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#64748b' }}>
                  THIS MONTH:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Boxes Sold:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {formatNumber(revenueData.thisMonth.boxesSold)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Revenue:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {revenueData.thisMonth.boxesSold} × ₹900 = {formatCurrency(revenueData.thisMonth.revenue)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Cost:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {revenueData.thisMonth.boxesSold} × ₹400 = {formatCurrency(revenueData.thisMonth.cost)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      borderRadius: 1,
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                      PAPER PROFIT:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                      {formatCurrency(revenueData.thisMonth.profit)} 🔥
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#dcfce7' }}>
                      {revenueData.thisMonth.margin.toFixed(1)}% margin
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ background: '#ffffff' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#64748b' }}>
                  LIFETIME TOTALS:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lifetime Paper Revenue:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {formatCurrency(revenueData.lifetime.revenue)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lifetime Paper Profit:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                      {formatCurrency(revenueData.lifetime.profit)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Reorder Predictions */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Reorder Predictions (AI)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on merchant usage patterns
                </Typography>
              </Box>
            </Box>
            {urgentCount > 0 && (
              <Chip
                label={`${urgentCount} Urgent`}
                color="error"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9' }}>Merchant</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9', textAlign: 'right' }}>
                  Est. Rolls Left
                </TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9', textAlign: 'center' }}>
                  Reorder In
                </TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9', textAlign: 'center', width: 80 }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictions
                .sort((a, b) => a.reorderInDays - b.reorderInDays)
                .map((pred) => (
                  <TableRow
                    key={pred.merchantId}
                    sx={{
                      background: pred.urgency === 'urgent' ? '#fef2f2' : '#ffffff',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {pred.merchantName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pred.merchantId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                      {pred.estimatedRollsLeft}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: getUrgencyColor(pred.urgency),
                        }}
                      >
                        {getReorderLabel(pred.reorderInDays)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography variant="body1">{getUrgencyIcon(pred.urgency)}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#dc2626' }}>
                    🔴 = Send WhatsApp NOW
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#eab308' }}>
                    🟡 = Schedule WhatsApp in 3 days
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#16a34a' }}>
                    🟢 = No action needed
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<WhatsAppIcon />}
                onClick={handleBulkWhatsApp}
                disabled={urgentCount === 0}
                sx={{ fontWeight: 700 }}
              >
                📲 Send Bulk WhatsApp to {urgentCount} 🔴 Merchants
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Layout>
  );
};

export default PaperRollManagement;
