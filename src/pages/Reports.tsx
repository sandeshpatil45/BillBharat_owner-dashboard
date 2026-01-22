import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import KPICard from '../components/common/KPICard';
import { reportService } from '../services/report.service';
import type { RevenueReport, PlanDistribution, ChartData } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [planDistribution, setPlanDistribution] = useState<PlanDistribution[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [revenueData, planData, trendData] = await Promise.all([
        reportService.getRevenueReport(),
        reportService.getPlanDistribution(),
        reportService.getRevenueTrend(6),
      ]);

      setRevenueReport(revenueData);
      setPlanDistribution(planData);
      setRevenueTrend(trendData);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton type="kpi" />
        <Box sx={{ mt: 3 }}>
          <LoadingSkeleton type="chart" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Business insights and analytics
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Revenue Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Revenue This Month"
            value={formatCurrency(revenueReport?.totalRevenueThisMonth || 0)}
            icon={<TrendingUpIcon />}
            color="#4caf50"
            backgroundColor="#e8f5e9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="New Customers This Month"
            value={formatNumber(revenueReport?.newCustomersThisMonth || 0)}
            icon={<TrendingUpIcon />}
            color="#2196f3"
            backgroundColor="#e3f2fd"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Renewal Revenue"
            value={formatCurrency(revenueReport?.renewalRevenue || 0)}
            icon={<TrendingUpIcon />}
            color="#ff9800"
            backgroundColor="#fff3e0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="New Revenue"
            value={formatCurrency(revenueReport?.newRevenue || 0)}
            icon={<TrendingUpIcon />}
            color="#9c27b0"
            backgroundColor="#f3e5f5"
          />
        </Grid>
      </Grid>

      {/* Revenue Trend Chart */}
      {revenueTrend.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Revenue Trend (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4caf50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Plan Distribution */}
      {planDistribution.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Plan-wise Distribution
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Plan Name</TableCell>
                    <TableCell align="right">Subscribers</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {planDistribution.map((plan) => (
                    <TableRow key={plan.planName} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{plan.planName}</TableCell>
                      <TableCell align="right">{formatNumber(plan.subscriberCount)}</TableCell>
                      <TableCell align="right">{formatCurrency(plan.revenue)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>TOTAL</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatNumber(planDistribution.reduce((sum, p) => sum + p.subscriberCount, 0))}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {formatCurrency(planDistribution.reduce((sum, p) => sum + p.revenue, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default Reports;
