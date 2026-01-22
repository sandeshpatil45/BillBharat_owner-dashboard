import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { subscriptionService } from '../services/subscription.service';
import { SubscriptionStatus, type Subscription, type SubscriptionFilters } from '../types';
import { formatDate, formatCurrency, getStatusColor, debounce, exportToCSV } from '../utils/helpers';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../utils/constants';

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SubscriptionFilters>({
    status: 'ALL',
    search: '',
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await subscriptionService.getSubscriptions(filters, page + 1, rowsPerPage);
      setSubscriptions(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page, rowsPerPage, filters]);

  const handleSearchChange = debounce((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(0);
  }, 500);

  const handleFilterChange = (key: keyof SubscriptionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleExport = () => {
    if (subscriptions.length === 0) return;
    const exportData = subscriptions.map((sub) => ({
      'Customer Name': sub.customerName,
      'Plan Name': sub.planName,
      'Amount Paid': sub.amountPaid,
      'Start Date': formatDate(sub.startDate),
      'End Date': formatDate(sub.endDate),
      'Status': sub.status,
      'Days Remaining': sub.daysRemaining,
    }));
    exportToCSV(exportData, 'subscriptions');
  };

  const getStatusChip = (status: string) => {
    const color = getStatusColor(status);
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: color,
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    );
  };

  const getRowStyle = (status: string, daysRemaining: number) => {
    if (status === SubscriptionStatus.EXPIRED) {
      return { backgroundColor: '#ffebee' };
    } else if (status === SubscriptionStatus.EXPIRING_SOON || daysRemaining <= 7) {
      return { backgroundColor: '#fff3e0' };
    }
    return {};
  };

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Subscriptions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and manage subscription plans
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
            placeholder="Search by customer name..."
            size="small"
            sx={{ flexGrow: 1, minWidth: 300 }}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Status"
            size="small"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value={SubscriptionStatus.ACTIVE}>Active</MenuItem>
            <MenuItem value={SubscriptionStatus.EXPIRED}>Expired</MenuItem>
            <MenuItem value={SubscriptionStatus.EXPIRING_SOON}>Expiring Soon</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={subscriptions.length === 0}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton type="table" rows={10} />
      ) : subscriptions.length === 0 ? (
        <EmptyState message="No subscriptions found. Try adjusting your filters." />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Days Remaining</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id} hover sx={getRowStyle(subscription.status, subscription.daysRemaining)}>
                    <TableCell sx={{ fontWeight: 600 }}>{subscription.customerName}</TableCell>
                    <TableCell>{subscription.planName}</TableCell>
                    <TableCell>{formatCurrency(subscription.amountPaid)}</TableCell>
                    <TableCell>{formatDate(subscription.startDate)}</TableCell>
                    <TableCell>{formatDate(subscription.endDate)}</TableCell>
                    <TableCell>{getStatusChip(subscription.status)}</TableCell>
                    <TableCell>
                      {subscription.daysRemaining < 0 ? 'Expired' : `${subscription.daysRemaining} days`}
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
            rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          />
        </Paper>
      )}
    </Layout>
  );
};

export default Subscriptions;
