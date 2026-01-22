import dayjs from 'dayjs';
import { SubscriptionStatus } from '../types';
import { DATE_FORMAT } from './constants';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date, format: string = DATE_FORMAT): string => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};

// Calculate days remaining
export const calculateDaysRemaining = (endDate: string): number => {
  const end = dayjs(endDate);
  const today = dayjs();
  return end.diff(today, 'day');
};

// Get subscription status based on days remaining
export const getSubscriptionStatus = (endDate: string): string => {
  const daysRemaining = calculateDaysRemaining(endDate);
  
  if (daysRemaining < 0) {
    return SubscriptionStatus.EXPIRED;
  } else if (daysRemaining <= 7) {
    return SubscriptionStatus.EXPIRING_SOON;
  } else {
    return SubscriptionStatus.ACTIVE;
  }
};

// Mask mobile number
export const maskMobileNumber = (mobile: string, mask: boolean = false): string => {
  if (!mask || !mobile) return mobile;
  if (mobile.length < 10) return mobile;
  return `${mobile.slice(0, 2)}${'*'.repeat(mobile.length - 4)}${mobile.slice(-2)}`;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Export data to CSV
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${dayjs().format('YYYY-MM-DD_HHmmss')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return '#4caf50';
    case SubscriptionStatus.EXPIRED:
      return '#f44336';
    case SubscriptionStatus.EXPIRING_SOON:
      return '#ff9800';
    default:
      return '#9e9e9e';
  }
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Calculate percentage change
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Check if role is allowed
export const isRoleAllowed = (role: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(role);
};

// Get initials from name
export const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
