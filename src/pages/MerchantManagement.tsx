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
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TablePagination,
  Alert,
  IconButton,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { merchantService } from '../services/merchant.service';
import type {
  MerchantListItem,
  MerchantDetail,
  MerchantStats,
  MerchantStatus,
  MerchantFilters,
} from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import dayjs from 'dayjs';

// Fallback data for when API is not ready
const FALLBACK_STATS: MerchantStats = {
  total: 380,
  active: 342,
  inactive: 38,
  activePercentage: 90,
};

const FALLBACK_MERCHANTS: MerchantListItem[] = [
  { id: 'M0001', shopName: 'Sharma Bakery', belt: '1B', type: 'Bakery', status: 'active', printerStatus: 'online', ownerName: 'Ramesh Sharma', city: 'Nashik' },
  { id: 'M0002', shopName: 'Raj Hotel', belt: '1A', type: 'Restaurant', status: 'active', printerStatus: 'online', ownerName: 'Raj Kumar', city: 'Nashik' },
  { id: 'M0003', shopName: 'Krishna Medical', belt: '1C', type: 'Medical', status: 'low-usage', printerStatus: 'online', ownerName: 'Krishna Patil', city: 'Nashik' },
  { id: 'M0004', shopName: 'New Fashion', belt: '2A', type: 'Garments', status: 'active', printerStatus: 'online', ownerName: 'Sunil Shah', city: 'Nashik' },
  { id: 'M0005', shopName: 'Highway Dhaba', belt: '3A', type: 'Restaurant', status: 'offline', printerStatus: 'offline', ownerName: 'Prakash Yadav', city: 'Nashik' },
  { id: 'M0006', shopName: 'Ganesh Kirana', belt: '1B', type: 'Kirana', status: 'active', printerStatus: 'online', ownerName: 'Ganesh More', city: 'Nashik' },
];

const FALLBACK_DETAIL: MerchantDetail = {
  id: 'M0001',
  shopName: 'Sharma Bakery',
  ownerName: 'Ramesh Sharma',
  phone: '98XXXXXXXX',
  address: 'Shop 12, Panchavati, Nashik',
  belt: '1B',
  type: 'Bakery',
  gpsLat: 19.9975,
  gpsLng: 73.7898,
  saleDate: '2025-04-15',
  soldBy: 'Amit',
  soldByExecId: '2',
  pricePaid: 6999,
  coupon: 'OFF1000',
  paymentMode: 'UPI',
  invoiceNumber: 'INV-2025-0045',
  printerInfo: {
    mac: 'AA:BB:CC:DD:EE:FF',
    status: 'online',
    lastBillTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    totalBillsPrinted: 2847,
    avgBillsPerDay: 47,
  },
  paperRollUsage: {
    estimatedRollsUsed: 38,
    totalRollsPurchased: 50,
    rollsRemaining: 12,
    reorderAlert: true,
    autoWhatsAppDays: 5,
    lastOrderDate: '2025-05-20',
    lastOrderQuantity: 50,
    lastOrderAmount: 900,
  },
  subscription: {
    isFreeYear: true,
    validTill: '2026-04-14',
    renewalDate: '2026-04-15',
    renewalAmount: 1999,
    daysToRenewal: 304,
  },
  supportHistory: [
    { date: '2025-04-22', issue: 'Bluetooth connect nahi ho raha', status: 'resolved' },
    { date: '2025-05-05', issue: 'Paper Roll Order', status: 'resolved' },
    { date: '2025-06-10', issue: 'Bill format change', status: 'resolved' },
  ],
};

const getStatusIcon = (status: MerchantStatus) => {
  switch (status) {
    case 'active':
      return <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />;
    case 'low-usage':
      return <WarningIcon sx={{ fontSize: 18, color: '#eab308' }} />;
    case 'offline':
      return <ErrorIcon sx={{ fontSize: 18, color: '#dc2626' }} />;
    case 'churned':
      return <CancelIcon sx={{ fontSize: 18, color: '#64748b' }} />;
  }
};

const getStatusLabel = (status: MerchantStatus) => {
  switch (status) {
    case 'active':
      return '🟢 Act';
    case 'low-usage':
      return '🟡 Low';
    case 'offline':
      return '🔴 Off';
    case 'churned':
      return '⚫ Churn';
  }
};

const MerchantManagement: React.FC = () => {
  const [stats, setStats] = useState<MerchantStats | null>(null);
  const [merchants, setMerchants] = useState<MerchantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState<MerchantFilters>({
    period: 'all',
    belt: 'all',
    status: 'all',
    search: '',
  });

  const [selectedMerchant, setSelectedMerchant] = useState<MerchantDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, merchantData] = await Promise.all([
        merchantService.getStats(),
        merchantService.getMerchants(filters, page + 1, rowsPerPage),
      ]);
      setStats(statsData);
      setMerchants(merchantData.data);
      setTotal(merchantData.total);
    } catch {
      setStats(FALLBACK_STATS);
      setMerchants(FALLBACK_MERCHANTS);
      setTotal(FALLBACK_MERCHANTS.length);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMerchantClick = async (merchantId: string) => {
    try {
      const detail = await merchantService.getMerchantDetail(merchantId);
      setSelectedMerchant(detail);
      setDialogOpen(true);
    } catch {
      setSelectedMerchant(FALLBACK_DETAIL);
      setDialogOpen(true);
    }
  };

  const handleCall = () => {
    if (selectedMerchant) {
      const telUrl = `tel:${selectedMerchant.phone}`;
      window.open(telUrl, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (selectedMerchant) {
      const waUrl = `https://wa.me/91${selectedMerchant.phone.replace(/\D/g, '')}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleDeactivate = async () => {
    if (selectedMerchant && window.confirm(`Deactivate ${selectedMerchant.shopName}?`)) {
      try {
        await merchantService.deactivateMerchant(selectedMerchant.id);
        setDialogOpen(false);
        fetchData();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  if (loading && !stats) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  const statsData = stats!;

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
          🏪 Merchant Management
        </Typography>
        
        {/* Stats Bar */}
        <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Merchants
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {formatNumber(statsData.total)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                {formatNumber(statsData.active)}{' '}
                <Typography component="span" variant="body2" sx={{ color: '#64748b' }}>
                  ({statsData.activePercentage}%)
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Inactive
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>
                {formatNumber(statsData.inactive)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>📅 Period</InputLabel>
              <Select
                value={filters.period}
                label="📅 Period"
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Belt</InputLabel>
              <Select
                value={filters.belt}
                label="Belt"
                onChange={(e) => setFilters({ ...filters, belt: e.target.value })}
              >
                <MenuItem value="all">All Belts</MenuItem>
                <MenuItem value="1A">Belt 1A</MenuItem>
                <MenuItem value="1B">Belt 1B</MenuItem>
                <MenuItem value="1C">Belt 1C</MenuItem>
                <MenuItem value="2A">Belt 2A</MenuItem>
                <MenuItem value="3A">Belt 3A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">🟢 Active</MenuItem>
                <MenuItem value="low-usage">🟡 Low Usage</MenuItem>
                <MenuItem value="offline">🔴 Offline</MenuItem>
                <MenuItem value="churned">⚫ Churned</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by shop name, owner, ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Merchant List */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            📋 Merchant List
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Shop Name</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>Belt</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 100 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 100 }}>Printer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {merchants.map((merchant) => (
                <TableRow
                  key={merchant.id}
                  hover
                  onClick={() => handleMerchantClick(merchant.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {merchant.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {merchant.shopName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {merchant.ownerName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={merchant.belt} size="small" sx={{ fontSize: 11 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{merchant.type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getStatusIcon(merchant.status)}
                      <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {getStatusLabel(merchant.status)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={merchant.printerStatus === 'online' ? 'Online' : 'Offline'}
                      size="small"
                      color={merchant.printerStatus === 'online' ? 'success' : 'error'}
                      sx={{ fontSize: 11 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Status Definitions */}
      <Paper sx={{ p: 2, mt: 2, background: '#fffbeb' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          STATUS DEFINITIONS:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, fontSize: 13 }}>
          <Typography variant="caption">🟢 Active = Printed bills in last 7 days</Typography>
          <Typography variant="caption">🟡 Low Usage = No bills in 7-15 days</Typography>
          <Typography variant="caption">🔴 Offline = No bills in 15+ days (CHURN RISK!)</Typography>
          <Typography variant="caption">⚫ Churned = No activity 30+ days</Typography>
        </Box>
      </Paper>

      {/* Merchant Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedMerchant && (
          <>
            <DialogTitle sx={{ background: '#1e293b', color: '#fff', pb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                🏪 {selectedMerchant.shopName.toUpperCase()} ({selectedMerchant.id})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={`Belt ${selectedMerchant.belt}`}
                  size="small"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                  variant="outlined"
                />
                <Chip
                  label={selectedMerchant.type}
                  size="small"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                  variant="outlined"
                />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Owner:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedMerchant.ownerName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Phone:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedMerchant.phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Address:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedMerchant.address}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          📍 GPS:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {selectedMerchant.gpsLat.toFixed(4)}° N, {selectedMerchant.gpsLng.toFixed(4)}° E
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              window.open(
                                `https://maps.google.com/?q=${selectedMerchant.gpsLat},${selectedMerchant.gpsLng}`,
                                '_blank'
                              )
                            }
                          >
                            <MapIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Sale Info */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Sale Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date of Sale:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dayjs(selectedMerchant.saleDate).format('DD-MMM-YYYY')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Sold By:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Exec #{selectedMerchant.soldByExecId} ({selectedMerchant.soldBy})
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Price Paid:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(selectedMerchant.pricePaid)} (Coupon: {selectedMerchant.coupon})
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Payment Mode:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedMerchant.paymentMode}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Invoice #:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {selectedMerchant.invoiceNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Printer Info */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Printer Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Printer MAC:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {selectedMerchant.printerInfo.mac}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Printer Status:
                        </Typography>
                        <Chip
                          label={selectedMerchant.printerInfo.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                          size="small"
                          color={selectedMerchant.printerInfo.status === 'online' ? 'success' : 'error'}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Bill Printed:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dayjs(selectedMerchant.printerInfo.lastBillTime).fromNow()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total Bills Printed:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatNumber(selectedMerchant.printerInfo.totalBillsPrinted)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Avg Bills/Day:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedMerchant.printerInfo.avgBillsPerDay}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Paper Roll Usage */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Paper Roll Usage
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Rolls Used:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedMerchant.paperRollUsage.estimatedRollsUsed} (of {selectedMerchant.paperRollUsage.totalRollsPurchased} purchased)
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          Last Paper Order:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dayjs(selectedMerchant.paperRollUsage.lastOrderDate).format('DD-MMM-YYYY')} (
                          {selectedMerchant.paperRollUsage.lastOrderQuantity} rolls,{' '}
                          {formatCurrency(selectedMerchant.paperRollUsage.lastOrderAmount)})
                        </Typography>
                      </Grid>
                      {selectedMerchant.paperRollUsage.reorderAlert && (
                        <Grid item xs={12}>
                          <Alert severity="warning">
                            🟡 REORDER ALERT: ~{selectedMerchant.paperRollUsage.rollsRemaining} rolls remaining
                            <br />
                            📱 Auto-trigger WhatsApp in {selectedMerchant.paperRollUsage.autoWhatsAppDays} days
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Subscription */}
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Subscription
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Year 1:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#16a34a' }}>
                          FREE (Valid till: {dayjs(selectedMerchant.subscription.validTill).format('DD-MMM-YYYY')})
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Renewal Due:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {dayjs(selectedMerchant.subscription.renewalDate).format('DD-MMM-YYYY')} (
                          {formatCurrency(selectedMerchant.subscription.renewalAmount)})
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Days to Renewal:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {selectedMerchant.subscription.daysToRenewal} days
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Support History */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Support History
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedMerchant.supportHistory.map((ticket, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 1.5,
                            background: '#f8fafc',
                            borderRadius: 1,
                            borderLeft: '3px solid #3b82f6',
                          }}
                        >
                          <Typography variant="body2">
                            <strong>{dayjs(ticket.date).format('DD-MMM')}:</strong> "{ticket.issue}" →{' '}
                            <Chip
                              label={ticket.status.toUpperCase()}
                              size="small"
                              color={ticket.status === 'resolved' ? 'success' : 'default'}
                              sx={{ fontSize: 10, height: 18 }}
                            />
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PhoneIcon />}
                      onClick={handleCall}
                      fullWidth
                    >
                      📞 Call Merchant
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      onClick={handleWhatsApp}
                      color="success"
                      fullWidth
                    >
                      💬 WhatsApp
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeactivate}
                      color="error"
                      fullWidth
                    >
                      🗑️ Deactivate
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

export default MerchantManagement;
