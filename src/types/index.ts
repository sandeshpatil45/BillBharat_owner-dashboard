// User and Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export const UserRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  COORDINATOR: 'COORDINATOR',
  SHOP: 'SHOP',
  STAFF: 'STAFF',
  WAITER: 'WAITER',
  CASHIER: 'CASHIER',
} as const;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Customer Types
export interface Customer {
  id: string;
  shopName: string;
  ownerName: string;
  mobileNumber: string;
  businessType: string;
  city: string;
  taluka: string;
  planName: string;
  planStartDate: string;
  planEndDate: string;
  status: string;
  hardwareType: string;
  salespersonName: string;
}

export const BusinessType = {
  KIRANA: 'KIRANA',
  RESTAURANT: 'RESTAURANT',
} as const;

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  EXPIRING_SOON: 'EXPIRING_SOON',
} as const;

export const HardwareType = {
  SOFTWARE_ONLY: 'SOFTWARE_ONLY',
  MACHINE: 'MACHINE',
} as const;

// Subscription Types
export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planName: string;
  amountPaid: number;
  startDate: string;
  endDate: string;
  status: string;
  daysRemaining: number;
}

// Plan Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
}

// Sales Types
export interface SalesPerformance {
  salespersonId: string;
  salespersonName: string;
  customersOnboarded: number;
  revenueGenerated: number;
  kiranaCount: number;
  restaurantCount: number;
  activeCount: number;
  expiredCount: number;
}

// Hardware Types
export interface Hardware {
  id: string;
  customerId: string;
  customerName: string;
  printerSerialNo: string;
  installDate: string;
  warrantyEndDate: string;
  replacementCount: number;
  status: string;
}

export const HardwareStatus = {
  ACTIVE: 'ACTIVE',
  UNDER_REPAIR: 'UNDER_REPAIR',
  REPLACED: 'REPLACED',
} as const;

// Dashboard KPI Types
export interface DashboardKPIs {
  totalCustomers: number;
  activeSubscriptions: number;
  expiringIn7Days: number;
  expiringIn30Days: number;
  expired: number;
  newThisMonth: number;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
}

export interface CustomerGrowthData {
  date: string;
  customers: number;
}

// Report Types
export interface RevenueReport {
  totalRevenueThisMonth: number;
  newCustomersThisMonth: number;
  renewalRevenue: number;
  newRevenue: number;
  customerGrowthPercentage: number;
}

export interface PlanDistribution {
  planName: string;
  subscriberCount: number;
  revenue: number;
}

// Filter Types
export interface CustomerFilters {
  city?: string[];
  taluka?: string[];
  plan?: string;
  status?: string;
  businessType?: string;
  search?: string;
}

export interface SubscriptionFilters {
  status?: string;
  search?: string;
}

export interface SalesFilters {
  startDate?: string;
  endDate?: string;
  city?: string;
  district?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Table Types
export interface TableProps<T> {
  data: T[];
  columns: TableColumn[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

export interface TableColumn {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}
