import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { salesService } from '../services/sales.service';
import type { SalesPerformance, SalesFilters } from '../types';
import { formatCurrency, formatNumber, exportToCSV } from '../utils/helpers';

const Sales: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SalesFilters>({});

  const fetchSalesData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await salesService.getSalesPerformance(filters);
      setSalesData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sales performance');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [filters]);

  const handleExport = () => {
    if (salesData.length === 0) return;
    const exportData = salesData.map((sales) => ({
      'Salesperson': sales.salespersonName,
      'Customers Onboarded': sales.customersOnboarded,
      'Revenue Generated': sales.revenueGenerated,
      'Kirana Count': sales.kiranaCount,
      'Restaurant Count': sales.restaurantCount,
      'Active Count': sales.activeCount,
      'Expired Count': sales.expiredCount,
    }));
    exportToCSV(exportData, 'sales_performance');
  };

  const totals = salesData.reduce(
    (acc, sales) => ({
      customersOnboarded: acc.customersOnboarded + sales.customersOnboarded,
      revenueGenerated: acc.revenueGenerated + sales.revenueGenerated,
      kiranaCount: acc.kiranaCount + sales.kiranaCount,
      restaurantCount: acc.restaurantCount + sales.restaurantCount,
      activeCount: acc.activeCount + sales.activeCount,
      expiredCount: acc.expiredCount + sales.expiredCount,
    }),
    {
      customersOnboarded: 0,
      revenueGenerated: 0,
      kiranaCount: 0,
      restaurantCount: 0,
      activeCount: 0,
      expiredCount: 0,
    }
  );

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Sales Performance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track sales team performance and revenue
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={filters.startDate || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            value={filters.endDate || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
          />
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={salesData.length === 0}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton type="table" rows={8} />
      ) : salesData.length === 0 ? (
        <EmptyState message="No sales data found." />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Salesperson</TableCell>
                  <TableCell align="right">Customers Onboarded</TableCell>
                  <TableCell align="right">Revenue Generated</TableCell>
                  <TableCell align="right">Kirana</TableCell>
                  <TableCell align="right">Restaurant</TableCell>
                  <TableCell align="right">Active</TableCell>
                  <TableCell align="right">Expired</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData.map((sales) => (
                  <TableRow key={sales.salespersonId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{sales.salespersonName}</TableCell>
                    <TableCell align="right">{formatNumber(sales.customersOnboarded)}</TableCell>
                    <TableCell align="right">{formatCurrency(sales.revenueGenerated)}</TableCell>
                    <TableCell align="right">{formatNumber(sales.kiranaCount)}</TableCell>
                    <TableCell align="right">{formatNumber(sales.restaurantCount)}</TableCell>
                    <TableCell align="right">{formatNumber(sales.activeCount)}</TableCell>
                    <TableCell align="right">{formatNumber(sales.expiredCount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatNumber(totals.customersOnboarded)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totals.revenueGenerated)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatNumber(totals.kiranaCount)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatNumber(totals.restaurantCount)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatNumber(totals.activeCount)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatNumber(totals.expiredCount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Layout>
  );
};

export default Sales;
