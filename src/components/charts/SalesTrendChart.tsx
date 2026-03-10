import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { SalesTrendData } from '../../types';
import dayjs from 'dayjs';

interface SalesTrendChartProps {
  data: SalesTrendData[];
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    label: dayjs(d.date).format('D MMM'),
  }));

  if (data.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 320,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No trend data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: '#1e293b' }}>
        📊 Sales Trend — Last 30 Days
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="machineSales"
            name="Machine Sales"
            stroke="#1976d2"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="paperRollOrders"
            name="Paper Roll Orders"
            stroke="#ff9800"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SalesTrendChart;
