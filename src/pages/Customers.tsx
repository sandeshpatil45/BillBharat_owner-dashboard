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
import { customerService } from '../services/customer.service';
import { SubscriptionStatus, BusinessType, type Customer, type CustomerFilters } from '../types';
import { formatDate, getStatusColor, debounce, exportToCSV } from '../utils/helpers';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../utils/constants';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<CustomerFilters>({
    status: 'ALL',
    businessType: 'ALL',
    search: '',
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await customerService.getCustomers(filters, page + 1, rowsPerPage);
      setCustomers(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, filters]);

  const handleSearchChange = debounce((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(0);
  }, 500);

  const handleFilterChange = (key: keyof CustomerFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleExport = () => {
    if (customers.length === 0) return;
    const exportData = customers.map((customer) => ({
      'Customer ID': customer.id,
      'Shop Name': customer.shopName,
      'Owner Name': customer.ownerName,
      'Mobile Number': customer.mobileNumber,
      'Business Type': customer.businessType,
      'City': customer.city,
      'Taluka': customer.taluka,
      'Plan Name': customer.planName,
      'Plan Start Date': formatDate(customer.planStartDate),
      'Plan End Date': formatDate(customer.planEndDate),
      'Status': customer.status,
      'Hardware': customer.hardwareType,
      'Salesperson': customer.salespersonName,
    }));
    exportToCSV(exportData, 'customers');
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

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage all customer records
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
            placeholder="Search by shop name, owner, or mobile..."
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
          <TextField
            select
            label="Business Type"
            size="small"
            value={filters.businessType}
            onChange={(e) => handleFilterChange('businessType', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value={BusinessType.KIRANA}>Kirana</MenuItem>
            <MenuItem value={BusinessType.RESTAURANT}>Restaurant</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={customers.length === 0}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton type="table" rows={10} />
      ) : customers.length === 0 ? (
        <EmptyState message="No customers found. Try adjusting your filters." />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Shop Name</TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Business Type</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Taluka</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Hardware</TableCell>
                  <TableCell>Salesperson</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{customer.shopName}</TableCell>
                    <TableCell>{customer.ownerName}</TableCell>
                    <TableCell>{customer.mobileNumber}</TableCell>
                    <TableCell>{customer.businessType}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.taluka}</TableCell>
                    <TableCell>{customer.planName}</TableCell>
                    <TableCell>{formatDate(customer.planStartDate)}</TableCell>
                    <TableCell>{formatDate(customer.planEndDate)}</TableCell>
                    <TableCell>{getStatusChip(customer.status)}</TableCell>
                    <TableCell>{customer.hardwareType}</TableCell>
                    <TableCell>{customer.salespersonName}</TableCell>
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

export default Customers;
