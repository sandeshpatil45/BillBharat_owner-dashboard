import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import KPICard from '../components/common/KPICard';
import CustomerGrowthChart from '../components/charts/CustomerGrowthChart';
import PieChart from '../components/charts/PieChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Layout from '../components/layout/Layout';
import { reportService } from '../services/report.service';
import type { DashboardKPIs, CustomerGrowthData, ChartData } from '../types';
import { formatNumber } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowthData[]>([]);
  const [subscriptionDist, setSubscriptionDist] = useState<ChartData[]>([]);
  const [businessTypeDist, setBusinessTypeDist] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [kpisData, growthData, subsDist, bizDist] = await Promise.all([
        reportService.getDashboardKPIs(),
        reportService.getCustomerGrowth(30),
        reportService.getSubscriptionDistribution(),
        reportService.getBusinessTypeDistribution(),
      ]);

      setKpis(kpisData);
      setCustomerGrowth(growthData);
      setSubscriptionDist(subsDist);
      setBusinessTypeDist(bizDist);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      // Set default values on error
      setKpis({
        totalCustomers: 0,
        activeSubscriptions: 0,
        expiringIn7Days: 0,
        expiringIn30Days: 0,
        expired: 0,
        newThisMonth: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !kpis) {
    return (
      <Layout>
        <LoadingSkeleton type="kpi" />
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LoadingSkeleton type="chart" />
            </Grid>
            <Grid item xs={12} md={6}>
              <LoadingSkeleton type="chart" />
            </Grid>
          </Grid>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Total Customers"
            value={formatNumber(kpis?.totalCustomers || 0)}
            icon={<PeopleIcon />}
            color="#1976d2"
            backgroundColor="#e3f2fd"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Active Subscriptions"
            value={formatNumber(kpis?.activeSubscriptions || 0)}
            icon={<CheckCircleIcon />}
            color="#4caf50"
            backgroundColor="#e8f5e9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Expiring in 7 Days"
            value={formatNumber(kpis?.expiringIn7Days || 0)}
            icon={<WarningIcon />}
            color="#ff9800"
            backgroundColor="#fff3e0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Expiring in 30 Days"
            value={formatNumber(kpis?.expiringIn30Days || 0)}
            icon={<WarningIcon />}
            color="#ffc107"
            backgroundColor="#fffde7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Expired"
            value={formatNumber(kpis?.expired || 0)}
            icon={<ErrorIcon />}
            color="#f44336"
            backgroundColor="#ffebee"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="New This Month"
            value={formatNumber(kpis?.newThisMonth || 0)}
            icon={<TrendingUpIcon />}
            color="#2196f3"
            backgroundColor="#e1f5fe"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomerGrowthChart data={customerGrowth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart
            title="Subscription Status"
            data={subscriptionDist}
            colors={['#4caf50', '#f44336']}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart
            title="Business Type Distribution"
            data={businessTypeDist}
            colors={['#2196f3', '#9c27b0']}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
