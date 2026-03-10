import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { downloadService } from '../services/download.service';
import type { Report, ReportCategory } from '../types';

// Fallback data for when API is not ready
const FALLBACK_REPORTS: Report[] = [
  // Financial
  { id: 'monthly-revenue', name: 'Monthly Revenue Report', category: 'financial', format: 'excel', description: 'Detailed monthly revenue breakdown' },
  { id: 'gst-summary', name: 'GST Summary', category: 'financial', format: 'excel', description: 'For CA filing' },
  { id: 'commission-payout', name: 'Commission Payout Sheet', category: 'financial', format: 'excel', description: 'Executive commission calculations' },
  { id: 'expense-report', name: 'Expense Report', category: 'financial', format: 'excel', description: 'All business expenses' },
  { id: 'unit-economics', name: 'Unit Economics Report', category: 'financial', format: 'excel', description: 'Per-unit profitability analysis' },
  { id: 'paper-pnl', name: 'Paper Roll P&L', category: 'financial', format: 'excel', description: 'Paper roll profit & loss' },
  
  // Sales
  { id: 'daily-sales', name: 'Daily Sales Report', category: 'sales', format: 'excel', description: 'Daily sales activity' },
  { id: 'exec-performance', name: 'Executive Performance Report', category: 'sales', format: 'excel', description: 'Individual executive metrics' },
  { id: 'belt-sales', name: 'Belt-wise Sales Report', category: 'sales', format: 'excel', description: 'Sales by territory' },
  { id: 'coupon-usage', name: 'Coupon Usage Report', category: 'sales', format: 'excel', description: 'Coupon redemption analysis' },
  { id: 'rejection-reasons', name: 'Rejection Reasons Report', category: 'sales', format: 'excel', description: 'Why demos failed' },
  { id: 'conversion-funnel', name: 'Conversion Funnel Report', category: 'sales', format: 'excel', description: 'Visit → Demo → Sale conversion' },
  
  // Merchant
  { id: 'merchant-master', name: 'Merchant Master List', category: 'merchant', format: 'excel', description: 'Complete merchant database' },
  { id: 'active-inactive', name: 'Active vs Inactive Report', category: 'merchant', format: 'excel', description: 'Merchant activity status' },
  { id: 'churn-risk', name: 'Churn Risk Report', category: 'merchant', format: 'excel', description: 'Merchants at risk of leaving' },
  { id: 'paper-reorder', name: 'Paper Roll Reorder Predictions', category: 'merchant', format: 'excel', description: 'AI-powered reorder forecasts' },
  { id: 'renewal-pipeline', name: 'Renewal Pipeline Report', category: 'merchant', format: 'excel', description: 'Upcoming subscription renewals' },
  { id: 'merchant-usage', name: 'Merchant Usage Analytics', category: 'merchant', format: 'excel', description: 'Bill printing patterns' },
  
  // Inventory
  { id: 'printer-stock', name: 'Printer Stock Report', category: 'inventory', format: 'excel', description: 'Current printer inventory' },
  { id: 'paper-inventory', name: 'Paper Roll Inventory Report', category: 'inventory', format: 'excel', description: 'Paper roll stock levels' },
  { id: 'mac-registry', name: 'Printer MAC Registry (Full)', category: 'inventory', format: 'excel', description: 'Complete MAC address database' },
  { id: 'inventory-movement', name: 'Inventory Movement Log', category: 'inventory', format: 'excel', description: 'Stock movement history' },
];

const getCategoryIcon = (category: ReportCategory) => {
  switch (category) {
    case 'financial':
      return <AttachMoneyIcon sx={{ fontSize: 28, color: '#16a34a' }} />;
    case 'sales':
      return <TrendingUpIcon sx={{ fontSize: 28, color: '#3b82f6' }} />;
    case 'merchant':
      return <StoreIcon sx={{ fontSize: 28, color: '#9333ea' }} />;
    case 'inventory':
      return <InventoryIcon sx={{ fontSize: 28, color: '#ea580c' }} />;
  }
};

const getCategoryTitle = (category: ReportCategory) => {
  switch (category) {
    case 'financial':
      return 'FINANCIAL';
    case 'sales':
      return 'SALES';
    case 'merchant':
      return 'MERCHANT';
    case 'inventory':
      return 'INVENTORY';
  }
};

const ReportsDownloads: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const reportsList = await downloadService.getReportsList();
      setReports(reportsList);
    } catch {
      setReports(FALLBACK_REPORTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = async (report: Report) => {
    setDownloading(report.id);
    try {
      // Simulate download
      downloadService.triggerDownload(report.id, `${report.name}.${report.format}`);
      setTimeout(() => {
        setDownloading(null);
      }, 1000);
    } catch (error: any) {
      alert(error.message || 'Failed to download report');
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  const categories: ReportCategory[] = ['financial', 'sales', 'merchant', 'inventory'];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          📊 Reports & Downloads
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Download comprehensive business reports in Excel format
        </Typography>
      </Box>

      {/* Report Categories */}
      <Grid container spacing={3}>
        {categories.map((category) => {
          const categoryReports = reports.filter((r) => r.category === category);
          
          return (
            <Grid item xs={12} key={category}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  {getCategoryIcon(category)}
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {getCategoryTitle(category)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {categoryReports.map((report) => (
                    <Box key={report.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                          background: '#f8fafc',
                          borderRadius: 1,
                          border: '1px solid #e2e8f0',
                          '&:hover': {
                            background: '#f1f5f9',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <DescriptionIcon sx={{ color: '#64748b' }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {report.name}
                            </Typography>
                            {report.description && (
                              <Typography variant="caption" color="text.secondary">
                                {report.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(report)}
                          disabled={downloading === report.id}
                          sx={{ fontWeight: 600, minWidth: 120 }}
                        >
                          {downloading === report.id ? 'Downloading...' : `📥 ${report.format.toUpperCase()}`}
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
};

export default ReportsDownloads;
