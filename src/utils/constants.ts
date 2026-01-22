import { UserRole } from '../types';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// App Configuration
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'BillBharat Owner Dashboard';

// Allowed Roles for Access
export const ALLOWED_ROLES: string[] = [
  UserRole.OWNER,
  UserRole.ADMIN,
  UserRole.COORDINATOR,
];

// Local Storage Keys
export const TOKEN_KEY = 'billbharat_auth_token';
export const USER_KEY = 'billbharat_user';

// Pagination
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [25, 50, 100];

// Refresh Interval (5 minutes)
export const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

// Date Formats
export const DATE_FORMAT = 'DD MMM YYYY';
export const DATETIME_FORMAT = 'DD MMM YYYY HH:mm';

// Status Colors
export const STATUS_COLORS = {
  ACTIVE: '#4caf50',
  EXPIRED: '#f44336',
  EXPIRING_SOON: '#ff9800',
};

// Business Type Colors
export const BUSINESS_TYPE_COLORS = {
  KIRANA: '#2196f3',
  RESTAURANT: '#9c27b0',
};

// Navigation Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CUSTOMERS: '/customers',
  SUBSCRIPTIONS: '/subscriptions',
  SALES: '/sales',
  HARDWARE: '/hardware',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ACCESS_DENIED: '/access-denied',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    EXPORT: '/customers/export',
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    DETAIL: (id: string) => `/subscriptions/${id}`,
    EXPORT: '/subscriptions/export',
  },
  SALES: {
    PERFORMANCE: '/sales/performance',
    EXPORT: '/sales/export',
  },
  HARDWARE: {
    LIST: '/hardware',
  },
  REPORTS: {
    DASHBOARD_KPIS: '/reports/dashboard-kpis',
    REVENUE: '/reports/revenue',
    PLAN_DISTRIBUTION: '/reports/plan-distribution',
    CUSTOMER_GROWTH: '/reports/customer-growth',
  },
};
