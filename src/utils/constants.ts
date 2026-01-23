import { UserRole } from '../types';

// API Configuration
// Base URL should NOT include /api suffix - it's added in endpoint constants below
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  BUSINESS: {
    CURRENT: '/api/business/current',
    SETUP: '/api/business/setup',
    UPDATE: '/api/business/update',
  },
  CUSTOMERS: {
    LIST: '/api/business/current',
    DETAIL: (id: string) => `/api/business/${id}`,
    EXPORT: '/api/business/export',
  },
  SUBSCRIPTIONS: {
    CURRENT: '/api/subscriptions/current',
    START_TRIAL: '/api/subscriptions/start-trial',
    CREATE: '/api/subscriptions/create',
    UPGRADE: '/api/subscriptions/upgrade',
    BILLING_HISTORY: '/api/subscriptions/billing-history',
    LIST: '/api/subscriptions',
    DETAIL: (id: string) => `/api/subscriptions/${id}`,
    EXPORT: '/api/subscriptions/export',
  },
  PLANS: {
    LIST: '/api/plans',
    DETAIL: (id: string) => `/api/plans/${id}`,
  },
  PAYMENTS: {
    CREATE_ORDER: '/api/payments/create-order',
    VERIFY: '/api/payments/verify',
  },
  BILLS: {
    LIST: '/api/bills',
    DETAIL: (id: string) => `/api/bills/${id}`,
    BY_NUMBER: (billNumber: string) => `/api/bills/number/${billNumber}`,
    DATE_RANGE: '/api/bills/date-range',
  },
  INVOICES: {
    LIST: '/api/invoices',
    DETAIL: (id: string) => `/api/invoices/${id}`,
    DATE_RANGE: '/api/invoices/date-range',
  },
  SALES: {
    PERFORMANCE: '/api/bills',
    EXPORT: '/api/bills/export',
  },
  ITEMS: {
    LIST: '/api/items',
    LOW_STOCK: '/api/items/low-stock',
    FAST_MOVING: '/api/items/fast-items',
  },
  HARDWARE: {
    LIST: '/api/hardware',
  },
  REPORTS: {
    TODAY_SALES: '/api/reports/today-sales',
    MONTHLY_SALES: '/api/reports/monthly-sales',
    SALES: '/api/reports/sales',
    STAFF_PERFORMANCE: '/restaurant/reports/staff',
    SALES_REPORT: '/restaurant/reports/sales',
    DASHBOARD_KPIS: '/api/reports/dashboard-kpis',
    REVENUE: '/api/reports/revenue',
    PLAN_DISTRIBUTION: '/api/reports/plan-distribution',
    CUSTOMER_GROWTH: '/api/reports/customer-growth',
  },
  USER: {
    ELIGIBILITY: '/api/user/eligibility',
  },
};
