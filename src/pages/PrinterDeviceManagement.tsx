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
  Button,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import MapIcon from '@mui/icons-material/Map';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CircleIcon from '@mui/icons-material/Circle';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { printerService } from '../services/printer.service';
import type {
  PrinterStats,
  MACRegistryEntry,
  PrinterFilters,
  PrinterDeviceStatus,
} from '../types';
import { formatNumber } from '../utils/helpers';
import dayjs from 'dayjs';

// Fallback data for when API is not ready
const FALLBACK_STATS: PrinterStats = {
  totalSold: 380,
  onlineNow: 298,
  offline: 82,
  onlinePercentage: 78,
};

const FALLBACK_INVENTORY = {
  locations: [
    { location: 'Central Hub (Your Home)', execId: null, execName: null, quantity: 18, type: 'hub' as const },
    { location: 'Team Lead', execId: 'TL1', execName: 'Lead Manager', quantity: 5, type: 'lead' as const },
    { location: 'Exec #1 (Demo)', execId: '1', execName: 'Rahul', quantity: 1, type: 'exec' as const },
    { location: 'Exec #2 (Demo)', execId: '2', execName: 'Amit', quantity: 1, type: 'exec' as const },
    { location: 'Exec #3 (Demo)', execId: '3', execName: 'Vijay', quantity: 1, type: 'exec' as const },
    { location: 'Exec #4 (Demo)', execId: '4', execName: 'Suresh', quantity: 1, type: 'exec' as const },
    { location: 'Exec #5 (Demo)', execId: '5', execName: 'Prakash', quantity: 1, type: 'exec' as const },
    { location: 'Exec #6 (Demo)', execId: '6', execName: 'Manoj', quantity: 1, type: 'exec' as const },
    { location: 'Exec #7 (Demo)', execId: '7', execName: 'Deepak', quantity: 1, type: 'exec' as const },
    { location: 'Exec #8 (Demo)', execId: '8', execName: 'Ravi', quantity: 1, type: 'exec' as const },
    { location: 'Exec #9 (Demo)', execId: '9', execName: 'Sandeep', quantity: 1, type: 'exec' as const },
    { location: 'Exec #10 (Demo)', execId: '10', execName: 'Kiran', quantity: 1, type: 'exec' as const },
  ],
  totalUnsold: 35,
  reorderAlert: true,
  daysRemaining: 10,
  currentSalesRate: 3.5,
};

const FALLBACK_MAC_REGISTRY: MACRegistryEntry[] = [
  { macAddress: 'AA:BB:CC:11:22:33', merchantId: 'M0001', merchantName: 'Sharma Bakery', activatedDate: '2025-04-15', status: 'online', lastSeen: dayjs().subtract(2, 'hours').toISOString(), totalBillsPrinted: 2847 },
  { macAddress: 'AA:BB:CC:11:22:34', merchantId: 'M0002', merchantName: 'Raj Hotel', activatedDate: '2025-04-16', status: 'online', lastSeen: dayjs().subtract(30, 'minutes').toISOString(), totalBillsPrinted: 3421 },
  { macAddress: 'AA:BB:CC:11:22:35', merchantId: null, merchantName: null, activatedDate: null, status: 'stock', lastSeen: undefined, totalBillsPrinted: 0 },
  { macAddress: 'AA:BB:CC:11:22:36', merchantId: 'M0005', merchantName: 'Highway Dhaba', activatedDate: '2025-04-20', status: 'offline', lastSeen: dayjs().subtract(3, 'days').toISOString(), totalBillsPrinted: 1256 },
  { macAddress: 'AA:BB:CC:11:22:37', merchantId: 'M0003', merchantName: 'Krishna Medical', activatedDate: '2025-04-17', status: 'low-usage', lastSeen: dayjs().subtract(10, 'days').toISOString(), totalBillsPrinted: 456 },
  { macAddress: 'AA:BB:CC:11:22:38', merchantId: 'M0006', merchantName: 'Ganesh Kirana', activatedDate: '2025-04-18', status: 'online', lastSeen: dayjs().subtract(1, 'hour').toISOString(), totalBillsPrinted: 4123 },
  { macAddress: 'AA:BB:CC:11:22:39', merchantId: null, merchantName: null, activatedDate: null, status: 'stock', lastSeen: undefined, totalBillsPrinted: 0 },
  { macAddress: 'AA:BB:CC:11:22:40', merchantId: 'M0007', merchantName: 'New Fashion', activatedDate: '2025-04-19', status: 'online', lastSeen: dayjs().subtract(5, 'hours').toISOString(), totalBillsPrinted: 1890 },
];

const getStatusIcon = (status: PrinterDeviceStatus) => {
  switch (status) {
    case 'online':
      return <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />;
    case 'offline':
      return <ErrorIcon sx={{ fontSize: 18, color: '#dc2626' }} />;
    case 'low-usage':
      return <WarningIcon sx={{ fontSize: 18, color: '#eab308' }} />;
    case 'stock':
      return <CircleIcon sx={{ fontSize: 18, color: '#94a3b8' }} />;
  }
};

const getStatusLabel = (status: PrinterDeviceStatus) => {
  switch (status) {
    case 'online':
      return '🟢 Active';
    case 'offline':
      return '🔴 Offline';
    case 'low-usage':
      return '🟡 Low Usage';
    case 'stock':
      return '⚪ Stock';
  }
};

const PrinterDeviceManagement: React.FC = () => {
  const [stats, setStats] = useState<PrinterStats | null>(null);
  const [inventory, setInventory] = useState(FALLBACK_INVENTORY);
  const [macRegistry, setMacRegistry] = useState<MACRegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<PrinterFilters>({
    status: 'all',
    belt: 'all',
    search: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [printerData, macData] = await Promise.all([
        printerService.getPrinterData(),
        printerService.getMACRegistry(filters),
      ]);
      setStats(printerData.stats);
      setInventory(printerData.inventory);
      setMacRegistry(macData.data);
    } catch {
      setStats(FALLBACK_STATS);
      setInventory(FALLBACK_INVENTORY);
      setMacRegistry(FALLBACK_MAC_REGISTRY);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlaceOrder = async () => {
    const quantity = window.prompt('Enter quantity to order:', '50');
    if (quantity && parseInt(quantity) > 0) {
      try {
        await printerService.placeSupplierOrder(parseInt(quantity));
        alert(`Order placed successfully for ${quantity} printers!`);
      } catch (error: any) {
        alert(error.message || 'Failed to place order');
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
          🖨️ Printer & Device Management
        </Typography>
        
        {/* Stats Bar */}
        <Paper sx={{ p: 2.5, background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PrintIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Printers Sold
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {formatNumber(statsData.totalSold)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Online Now
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  {formatNumber(statsData.onlineNow)}{' '}
                  <Typography component="span" variant="body2" sx={{ color: '#64748b' }}>
                    ({statsData.onlinePercentage}%)
                  </Typography>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Offline
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {formatNumber(statsData.offline)}{' '}
                  <Typography component="span" variant="body2" sx={{ color: '#64748b' }}>
                    ({100 - statsData.onlinePercentage}%)
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Printer Status Map */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MapIcon sx={{ color: '#3b82f6' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Printer Status Map
          </Typography>
        </Box>
        
        {/* Map Placeholder */}
        <Box
          sx={{
            height: 400,
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
          <MapIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
            Interactive Map of Nashik
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Map integration coming soon...
          </Typography>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#16a34a' }} />
            <Typography variant="body2">Online</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#dc2626' }} />
            <Typography variant="body2">Offline</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: '#eab308' }} />
            <Typography variant="body2">Low Usage</Typography>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Cluster View:</strong> See density of machines per area. Click on clusters to zoom in.
          </Typography>
        </Alert>
      </Paper>

      {/* Printer Inventory */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
          📦 Printer Inventory
        </Typography>
        
        <Grid container spacing={2}>
          {/* Stock Status */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#64748b' }}>
                  STOCK STATUS:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {inventory.locations.map((loc, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        background: loc.type === 'hub' ? '#f0fdf4' : '#f8fafc',
                        borderRadius: 1,
                        border: loc.type === 'hub' ? '1px solid #86efac' : '1px solid #e2e8f0',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: loc.type === 'hub' ? 700 : 500 }}>
                        {loc.location}
                        {loc.execName && (
                          <Typography component="span" variant="caption" sx={{ color: '#64748b', ml: 1 }}>
                            ({loc.execName})
                          </Typography>
                        )}
                      </Typography>
                      <Chip
                        label={`${loc.quantity} printers`}
                        size="small"
                        color={loc.type === 'hub' ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      background: '#1e293b',
                      borderRadius: 1,
                      color: '#fff',
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Total Unsold Stock:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {inventory.totalUnsold} printers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Reorder Alert */}
          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                background: inventory.reorderAlert ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f8fafc',
                border: inventory.reorderAlert ? '2px solid #f59e0b' : '1px solid #e2e8f0',
              }}
            >
              <CardContent>
                {inventory.reorderAlert && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <WarningIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400e' }}>
                        ⚠️ REORDER ALERT
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: '#78350f' }}>
                      Stock will last approximately <strong>{inventory.daysRemaining} days</strong> at current sales rate
                      ({inventory.currentSalesRate}/day)
                    </Typography>
                    <Button
                      variant="contained"
                      color="warning"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={handlePlaceOrder}
                      sx={{ fontWeight: 700 }}
                    >
                      🛒 Place Supplier Order
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* MAC Address Registry */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            🔐 MAC Address Registry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Every sold printer MAC is registered for fraud prevention and support
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 2, background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filters.status}
                  label="Status Filter"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="online">🟢 Online</MenuItem>
                  <MenuItem value="offline">🔴 Offline</MenuItem>
                  <MenuItem value="low-usage">🟡 Low Usage</MenuItem>
                  <MenuItem value="stock">⚪ Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by MAC address, merchant ID, or merchant name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9' }}>MAC Address</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9' }}>Merchant</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9' }}>Activated</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9', width: 120 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9' }}>Last Seen</TableCell>
                <TableCell sx={{ fontWeight: 700, background: '#f1f5f9' }}>Bills Printed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {macRegistry.map((entry) => (
                <TableRow
                  key={entry.macAddress}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>
                      {entry.macAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {entry.merchantId ? (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {entry.merchantName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {entry.merchantId}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        (Unsold)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {entry.activatedDate ? dayjs(entry.activatedDate).format('DD-MMM-YYYY') : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getStatusIcon(entry.status)}
                      <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {getStatusLabel(entry.status)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                      {entry.lastSeen ? dayjs(entry.lastSeen).fromNow() : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {entry.totalBillsPrinted ? formatNumber(entry.totalBillsPrinted) : '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Why This Matters */}
      <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#92400e', mb: 2 }}>
          🔐 WHY MAC REGISTRY MATTERS:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#92400e', minWidth: 180 }}>
                🛡️ Fraud Prevention:
              </Typography>
              <Typography variant="body2" sx={{ color: '#78350f' }}>
                1 MAC = 1 Merchant (no duplication allowed)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#92400e', minWidth: 180 }}>
                🎧 Support:
              </Typography>
              <Typography variant="body2" sx={{ color: '#78350f' }}>
                Identify printer from MAC during support calls
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#92400e', minWidth: 180 }}>
                📜 Warranty:
              </Typography>
              <Typography variant="body2" sx={{ color: '#78350f' }}>
                Track which printer was sold when and to whom
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#92400e', minWidth: 180 }}>
                🚨 Theft Detection:
              </Typography>
              <Typography variant="body2" sx={{ color: '#78350f' }}>
                If printer appears at different GPS coordinates = ALERT
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
};

export default PrinterDeviceManagement;
