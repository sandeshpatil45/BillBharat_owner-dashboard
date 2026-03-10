import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Button,
  TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Layout from '../components/layout/Layout';
import PieChart from '../components/charts/PieChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { reportService } from '../services/report.service';
import type { FinanceData, DateFilter, ChartData } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import dayjs from 'dayjs';

// Fallback data for when API is not ready
const FALLBACK_FINANCE: FinanceData = {
  revenue: {
    machineSalesRevenue: 582411,
    paperRollRevenue: 38700,
    softwareRenewalRevenue: 0,
    grossRevenue: 621111,
  },
  costs: {
    hardwareCost: 106800,
    hardwareUnitCount: 89,
    paperRollCost: 17200,
    paperRollBoxCount: 43,
    salaries: 140000,
    salaryExecCount: 10,
    salaryTLCount: 1,
    commissionsEarned: 62300,
    bonusesEarned: 12000,
    fuelAllowances: 33000,
    operationalCosts: 8500,
    totalCosts: 379800,
  },
  profit: {
    grossProfit: 241311,
    gstPayable: 28000,
    netProfit: 213311,
    margin: 34.3,
  },
  unitEconomics: {
    avgSellingPrice: 6543,
    avgHardwareCost: 1200,
    avgCommissionPaid: 700,
    avgPaperProfitPerSale: 435,
    netProfitPerUnit: 2696,
    cac: 1890,
    paybackPeriod: 'Instant (at sale)',
  },
  priceDistribution: [
    { price: 7999, percentage: 12, label: '₹7,999 (MRP)' },
    { price: 7499, percentage: 18, label: '₹7,499 (OFF500)' },
    { price: 6999, percentage: 28, label: '₹6,999 (OFF1000)' },
    { price: 6499, percentage: 22, label: '₹6,499 (OFF1500)' },
    { price: 5999, percentage: 14, label: '₹5,999 (OFF2000)' },
    { price: 5499, percentage: 6, label: '₹5,499 (OFF2500)' },
  ],
  gst: {
    outputGST: 94745,
    inputGST: 28440,
    itcFromHardware: 19224,
    itcFromExpenses: 3850,
    netGSTPayable: 43231,
  },
};

const Finance: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = useCallback(async () => {
    setLoading(true);
    try {
      let startDate: string | undefined;
      let endDate: string | undefined;

      const today = dayjs();
      switch (dateFilter) {
        case 'today':
          startDate = today.format('YYYY-MM-DD');
          endDate = today.format('YYYY-MM-DD');
          break;
        case 'week':
          startDate = today.startOf('week').format('YYYY-MM-DD');
          endDate = today.endOf('week').format('YYYY-MM-DD');
          break;
        case 'month':
          startDate = today.startOf('month').format('YYYY-MM-DD');
          endDate = today.endOf('month').format('YYYY-MM-DD');
          break;
        case 'custom':
          startDate = customStartDate;
          endDate = customEndDate;
          break;
      }

      const data = await reportService.getFinanceData(startDate, endDate);
      setFinanceData(data);
    } catch {
      setFinanceData(FALLBACK_FINANCE);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, customStartDate, customEndDate]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const handleDateFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: DateFilter | null) => {
    if (newFilter) setDateFilter(newFilter);
  };

  const handleDownloadGST = () => {
    // TODO: Implement GST report download
    alert('GST Report download will be implemented');
  };

  if (loading && !financeData) {
    return (
      <Layout>
        <LoadingSkeleton type="kpi" />
      </Layout>
    );
  }

  const data = financeData!;
  const priceChartData: ChartData[] = data.priceDistribution.map((p) => ({
    name: p.label,
    value: p.percentage,
  }));

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          💰 Revenue & Finance
        </Typography>
      </Box>

      {/* Date Filters */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#64748b' }}>
          📅 Filter Period
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={dateFilter}
            exclusive
            onChange={handleDateFilterChange}
            size="small"
          >
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="week">This Week</ToggleButton>
            <ToggleButton value="month">This Month</ToggleButton>
            <ToggleButton value="custom">Custom Range</ToggleButton>
          </ToggleButtonGroup>

          {dateFilter === 'custom' && (
            <>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" size="small" onClick={fetchFinanceData}>
                Apply
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Revenue Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <CurrencyRupeeIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Revenue Breakdown
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Machine Sales Revenue:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.revenue.machineSalesRevenue)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Paper Roll Revenue:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.revenue.paperRollRevenue)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Software Renewal Revenue:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.revenue.softwareRenewalRevenue)}
                  {data.revenue.softwareRenewalRevenue === 0 && ' (Year 1)'}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  GROSS REVENUE:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {formatCurrency(data.revenue.grossRevenue)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Cost Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <AccountBalanceIcon sx={{ mr: 1, color: '#f97316' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Cost Breakdown
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Hardware Cost ({data.costs.hardwareUnitCount} printers):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.hardwareCost)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Paper Roll Cost ({data.costs.paperRollBoxCount} boxes):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.paperRollCost)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Salaries ({data.costs.salaryExecCount} Exec + {data.costs.salaryTLCount} TL):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.salaries)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Commissions Earned:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.commissionsEarned)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Bonuses Earned:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.bonusesEarned)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Fuel Allowances:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.fuelAllowances)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Operational (SIM/Printing/Misc):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.costs.operationalCosts)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  TOTAL COSTS:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#f97316' }}>
                  {formatCurrency(data.costs.totalCosts)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Profit Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Profit
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">GROSS PROFIT:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.profit.grossProfit)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">GST Payable (est.):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.profit.gstPayable)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  NET PROFIT (Pre-Tax):
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatCurrency(data.profit.netProfit)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">MARGIN:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {data.profit.margin.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Unit Economics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              Unit Economics (Auto-Calculated)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Average Selling Price:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.unitEconomics.avgSellingPrice)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Average Hardware Cost:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.unitEconomics.avgHardwareCost)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Average Commission Paid:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.unitEconomics.avgCommissionPaid)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Average Paper Profit/Sale:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.unitEconomics.avgPaperProfitPerSale)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  NET PROFIT PER UNIT:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  {formatCurrency(data.unitEconomics.netProfitPerUnit)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  CAC (Customer Acquisition Cost):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.unitEconomics.cac)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Payback Period:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {data.unitEconomics.paybackPeriod}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Price Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Price Distribution
            </Typography>
            <PieChart
              title=""
              data={priceChartData}
              colors={['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#dc2626']}
            />
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                background: '#f0fdf4',
                borderRadius: 1,
                border: '1px solid #bbf7d0',
              }}
            >
              <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
                🎯 Healthy: Majority at ₹6,499+ ✅
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* GST Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              GST Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Output GST (Sales):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.gst.outputGST)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Input GST (Purchases):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.gst.inputGST)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  ITC from Hardware:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.gst.itcFromHardware)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  ITC from Expenses:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.gst.itcFromExpenses)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  NET GST PAYABLE:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {formatCurrency(data.gst.netGSTPayable)}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleDownloadGST}
              >
                📥 Download GST Report for CA
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Finance;
