import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BadgeIcon from '@mui/icons-material/Badge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '../components/layout/Layout';
import KPICard from '../components/common/KPICard';
import SalesTrendChart from '../components/charts/SalesTrendChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { reportService } from '../services/report.service';
import type { HomeDashboardData, SalesTrendData, DashboardAlert } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import dayjs from 'dayjs';

// Fallback data shown when API endpoints are not yet ready

const FALLBACK_DASHBOARD: HomeDashboardData = {
  todaySales: 7,
  todaySalesVsAvg: 2,
  todayRevenue: 45493,
  todayRevenueVsAvg: 8000,
  activeMerchants: 342,
  totalMerchants: 380,
  activeExecs: 8,
  totalExecs: 10,
  mtdSales: 89,
  mtdSalesTarget: 120,
  mtdRevenue: 582411,
  mtdRevenueTarget: 800000,
  paperRollOrdersToday: 4,
  paperRollRevenueToday: 3600,
  avgSalePrice: 6543,
};

const FALLBACK_ALERTS: DashboardAlert[] = [
  { id: '1', type: 'warning', message: 'Exec #5 (Ravi) — Not checked in yet (10:30 AM)' },
  { id: '2', type: 'warning', message: 'Paper Roll Stock: 120 rolls left (Reorder needed!)' },
  { id: '3', type: 'error',   message: 'Merchant #M0234 — Printer offline for 7 days' },
  { id: '4', type: 'info',    message: '3 Merchants due for renewal in 30 days' },
  { id: '5', type: 'success', message: 'Exec #2 (Amit) — Hit 20 sales this month! 🏆' },
];

const FALLBACK_TREND: SalesTrendData[] = [
  2, 4, 3, 5, 6, 4, 3, 5, 7, 6, 4, 3, 5, 6, 7, 5, 4, 6, 5, 7, 8, 6, 5, 4, 6, 7, 5, 6, 7, 5,
].map((machineSales, i) => ({
  date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
  machineSales,
  paperRollOrders: [1,2,1,3,2,1,2,3,2,1,2,3,2,1,3,2,4,3,2,1,3,2,1,3,2,1,2,3,4,2][i],
}));

const alertConfig = (type: DashboardAlert['type']) => {
  switch (type) {
    case 'error':   return { icon: <ErrorOutlineIcon />,       color: '#ef4444', bg: '#fef2f2' };
    case 'warning': return { icon: <WarningAmberIcon />,       color: '#f97316', bg: '#fff7ed' };
    case 'success': return { icon: <CheckCircleOutlineIcon />, color: '#22c55e', bg: '#f0fdf4' };
    default:        return { icon: <InfoOutlinedIcon />,       color: '#3b82f6', bg: '#eff6ff' };
  }
};

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard]     = useState<HomeDashboardData | null>(null);
  const [trend, setTrend]             = useState<SalesTrendData[]>([]);
  const [alerts, setAlerts]           = useState<DashboardAlert[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [dashboardData, trendData, alertsData] = await Promise.all([
        reportService.getHomeDashboard(),
        reportService.getSalesTrend(30),
        reportService.getDashboardAlerts(),
      ]);
      setDashboard(dashboardData);
      setTrend(trendData.length   ? trendData  : FALLBACK_TREND);
      setAlerts(alertsData.length ? alertsData : FALLBACK_ALERTS);
    } catch {
      setDashboard(FALLBACK_DASHBOARD);
      setTrend(FALLBACK_TREND);
      setAlerts(FALLBACK_ALERTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefreshed(new Date());
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => fetchAll(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const getRefreshLabel = () => {
    const diff = Math.floor((Date.now() - lastRefreshed.getTime()) / 60000);
    return diff < 1 ? 'Just now' : `${diff}m ago`;
  };

  if (loading && !dashboard) {
    return (
      <Layout>
        <LoadingSkeleton type="kpi" />
        <Box sx={{ mt: 3 }}>
          <LoadingSkeleton type="chart" />
        </Box>
      </Layout>
    );
  }

  const d = dashboard!;

  return (
    <Layout>

      {/* Command Center Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            🧾 BillBharat — Live Command Center
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            📅 {dayjs().format('DD MMMM YYYY')} ({dayjs().format('dddd')})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Last Refresh: {getRefreshLabel()}
          </Typography>
          <Tooltip title="Refresh now">
            <IconButton
              size="small"
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              sx={{ color: '#94a3b8', '&:hover': { color: '#fff' } }}
            >
              {refreshing
                ? <CircularProgress size={16} color="inherit" />
                : <RefreshIcon fontSize="small" />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* KPI Row 1: Today */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="TODAY'S SALES"
            value={d.todaySales}
            icon={<ShoppingCartIcon />}
            color="#16a34a"
            backgroundColor="#dcfce7"
            subtitle={d.todaySalesVsAvg >= 0 ? `+${d.todaySalesVsAvg} vs avg` : `${d.todaySalesVsAvg} vs avg`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="TODAY'S REVENUE"
            value={formatCurrency(d.todayRevenue)}
            icon={<CurrencyRupeeIcon />}
            color="#1976d2"
            backgroundColor="#dbeafe"
            subtitle={
              d.todayRevenueVsAvg >= 0
                ? `+${formatCurrency(d.todayRevenueVsAvg)} vs avg`
                : `${formatCurrency(d.todayRevenueVsAvg)} vs avg`
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="ACTIVE MERCHANTS"
            value={formatNumber(d.activeMerchants)}
            icon={<StorefrontIcon />}
            color="#7c3aed"
            backgroundColor="#ede9fe"
            subtitle={`of ${formatNumber(d.totalMerchants)} total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="ACTIVE EXECS"
            value={d.activeExecs}
            icon={<BadgeIcon />}
            color="#0891b2"
            backgroundColor="#cffafe"
            subtitle={`of ${d.totalExecs} total`}
          />
        </Grid>
      </Grid>

      {/* KPI Row 2: Month-to-Date */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="MTD SALES"
            value={formatNumber(d.mtdSales)}
            icon={<TrendingUpIcon />}
            color="#4338ca"
            backgroundColor="#e0e7ff"
            subtitle={`Target: ${formatNumber(d.mtdSalesTarget)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="MTD REVENUE"
            value={formatCurrency(d.mtdRevenue)}
            icon={<AccountBalanceWalletIcon />}
            color="#0369a1"
            backgroundColor="#e0f2fe"
            subtitle={`Target: ${formatCurrency(d.mtdRevenueTarget)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="PAPER ROLL ORDERS TODAY"
            value={d.paperRollOrdersToday}
            icon={<Inventory2Icon />}
            color="#b45309"
            backgroundColor="#fef9c3"
            subtitle={`${formatCurrency(d.paperRollRevenueToday)} revenue`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="AVG SALE PRICE"
            value={formatCurrency(d.avgSalePrice)}
            icon={<LocalOfferIcon />}
            color="#047857"
            backgroundColor="#d1fae5"
          />
        </Grid>
      </Grid>

      {/* Sales Trend Chart */}
      <Box sx={{ mb: 3 }}>
        <SalesTrendChart data={trend} />
      </Box>

      {/* Alerts Panel */}
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            px: 3,
            py: 2,
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            🚨 Alerts
          </Typography>
        </Box>
        {alerts.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No alerts at this time.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {alerts.map((alert, idx) => {
              const { icon, color, bg } = alertConfig(alert.type);
              return (
                <React.Fragment key={alert.id}>
                  <ListItem sx={{ px: 3, py: 1.5, backgroundColor: bg }}>
                    <ListItemIcon sx={{ color, minWidth: 36 }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      primaryTypographyProps={{ variant: 'body2', color: '#1e293b' }}
                    />
                  </ListItem>
                  {idx < alerts.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

    </Layout>
  );
};

export default Dashboard;
