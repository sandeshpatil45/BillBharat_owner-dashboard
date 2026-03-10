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

// Merchant Management Types
export type MerchantStatus = 'active' | 'low-usage' | 'offline' | 'churned';
export type MerchantType = 'Bakery' | 'Restaurant' | 'Medical' | 'Garments' | 'Kirana' | 'Other';

export interface MerchantListItem {
  id: string;
  shopName: string;
  belt: string;
  type: MerchantType;
  status: MerchantStatus;
  printerStatus: 'online' | 'offline';
  ownerName: string;
  city: string;
}

export interface PrinterInfo {
  mac: string;
  status: 'online' | 'offline';
  lastBillTime: string;
  totalBillsPrinted: number;
  avgBillsPerDay: number;
}

export interface PaperRollUsage {
  estimatedRollsUsed: number;
  totalRollsPurchased: number;
  rollsRemaining: number;
  reorderAlert: boolean;
  autoWhatsAppDays: number;
  lastOrderDate: string;
  lastOrderQuantity: number;
  lastOrderAmount: number;
}

export interface SubscriptionInfo {
  isFreeYear: boolean;
  validTill: string;
  renewalDate: string;
  renewalAmount: number;
  daysToRenewal: number;
}

export interface SupportTicket {
  date: string;
  issue: string;
  status: 'resolved' | 'pending' | 'closed';
}

export interface MerchantDetail {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  belt: string;
  type: MerchantType;
  gpsLat: number;
  gpsLng: number;
  saleDate: string;
  soldBy: string;
  soldByExecId: string;
  pricePaid: number;
  coupon: string;
  paymentMode: string;
  invoiceNumber: string;
  printerInfo: PrinterInfo;
  paperRollUsage: PaperRollUsage;
  subscription: SubscriptionInfo;
  supportHistory: SupportTicket[];
}

export interface MerchantStats {
  total: number;
  active: number;
  inactive: number;
  activePercentage: number;
}

export interface MerchantFilters {
  period?: string;
  belt?: string;
  status?: MerchantStatus | 'all';
  search?: string;
}

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

// Home Dashboard Types
export interface HomeDashboardData {
  todaySales: number;
  todaySalesVsAvg: number;
  todayRevenue: number;
  todayRevenueVsAvg: number;
  activeMerchants: number;
  totalMerchants: number;
  activeExecs: number;
  totalExecs: number;
  mtdSales: number;
  mtdSalesTarget: number;
  mtdRevenue: number;
  mtdRevenueTarget: number;
  paperRollOrdersToday: number;
  paperRollRevenueToday: number;
  avgSalePrice: number;
}

export interface SalesTrendData {
  date: string;
  machineSales: number;
  paperRollOrders: number;
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
}

// Finance & Revenue Types
export interface RevenueBreakdown {
  machineSalesRevenue: number;
  paperRollRevenue: number;
  softwareRenewalRevenue: number;
  grossRevenue: number;
}

export interface CostBreakdown {
  hardwareCost: number;
  hardwareUnitCount: number;
  paperRollCost: number;
  paperRollBoxCount: number;
  salaries: number;
  salaryExecCount: number;
  salaryTLCount: number;
  commissionsEarned: number;
  bonusesEarned: number;
  fuelAllowances: number;
  operationalCosts: number;
  totalCosts: number;
}

export interface ProfitData {
  grossProfit: number;
  gstPayable: number;
  netProfit: number;
  margin: number;
}

export interface UnitEconomics {
  avgSellingPrice: number;
  avgHardwareCost: number;
  avgCommissionPaid: number;
  avgPaperProfitPerSale: number;
  netProfitPerUnit: number;
  cac: number;
  paybackPeriod: string;
}

export interface PriceDistribution {
  price: number;
  percentage: number;
  label: string;
}

export interface GSTSummary {
  outputGST: number;
  inputGST: number;
  itcFromHardware: number;
  itcFromExpenses: number;
  netGSTPayable: number;
}

export interface FinanceData {
  revenue: RevenueBreakdown;
  costs: CostBreakdown;
  profit: ProfitData;
  unitEconomics: UnitEconomics;
  priceDistribution: PriceDistribution[];
  gst: GSTSummary;
}

export type DateFilter = 'today' | 'week' | 'month' | 'custom';

// Sales Team Performance Types
export type BeltLevel = '1A' | '1B' | '1C' | '2A' | '2B' | '3A' | '3B' | '4' | '5' | '6' | 'ALL';
export type PerformanceStatus = 'on-track' | 'below-target' | 'critical';

export interface ExecutivePerformance {
  id: string;
  rank: number;
  name: string;
  belt: BeltLevel;
  visits: number;
  demos: number;
  sales: number;
  revenue: number;
  avgPrice: number;
  status: PerformanceStatus;
}

export interface ConversionFunnel {
  totalVisits: number;
  totalDemos: number;
  totalSales: number;
  paperUpsell: number;
  paperUpsellPercentage: number;
  visitToDemoRate: number;
  demoToSaleRate: number;
  visitToDemoTarget: number;
  demoToSaleTarget: number;
  paperUpsellTarget: number;
}

export interface GPSLocation {
  lat: number;
  lng: number;
  timestamp: string;
  shopName?: string;
}

export interface ExecutiveDetail {
  id: string;
  name: string;
  belt: BeltLevel;
  checkInTime: string;
  checkOutTime: string;
  shopsVisitedToday: number;
  demosToday: number;
  salesToday: number;
  paperDeliveriesToday: number;
  couponsUsedToday: string[];
  couponPoolRemaining: number;
  couponPoolTotal: number;
  commissionEarned: number;
  bonusEarned: number;
  totalPayoutDue: number;
  gpsTrail: GPSLocation[];
}

export interface SalesTeamData {
  executives: ExecutivePerformance[];
  totals: {
    visits: number;
    demos: number;
    sales: number;
    revenue: number;
    avgPrice: number;
  };
  funnel: ConversionFunnel;
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

// Printer & Device Management Types
export type PrinterDeviceStatus = 'online' | 'offline' | 'low-usage' | 'stock';

export interface PrinterStats {
  totalSold: number;
  onlineNow: number;
  offline: number;
  onlinePercentage: number;
}

export interface PrinterLocationPoint {
  id: string;
  merchantId: string;
  shopName: string;
  lat: number;
  lng: number;
  status: PrinterDeviceStatus;
  macAddress: string;
}

export interface PrinterInventoryLocation {
  location: string;
  execId?: string;
  execName?: string;
  quantity: number;
  type: 'hub' | 'lead' | 'exec';
}

export interface PrinterInventory {
  locations: PrinterInventoryLocation[];
  totalUnsold: number;
  reorderAlert: boolean;
  daysRemaining: number;
  currentSalesRate: number;
}

export interface MACRegistryEntry {
  macAddress: string;
  merchantId: string | null;
  merchantName: string | null;
  activatedDate: string | null;
  status: PrinterDeviceStatus;
  lastSeen?: string;
  gpsLat?: number;
  gpsLng?: number;
  totalBillsPrinted?: number;
}

export interface PrinterDeviceData {
  stats: PrinterStats;
  locations: PrinterLocationPoint[];
  inventory: PrinterInventory;
  macRegistry: MACRegistryEntry[];
}

export interface PrinterFilters {
  status?: PrinterDeviceStatus | 'all';
  belt?: string;
  search?: string;
}

// Paper Roll Management Types
export interface PaperInventoryLocation {
  location: string;
  execId?: string;
  execName?: string;
  rolls: number;
  boxes: number;
  valueCost: number;
  type: 'hub' | 'lead' | 'exec';
}

export interface PaperInventoryStats {
  locations: PaperInventoryLocation[];
  totalRolls: number;
  totalBoxes: number;
  totalValue: number;
  dailyConsumptionRate: number;
  daysOfStockLeft: number;
  reorderThreshold: number;
}

export interface PaperRevenueData {
  thisMonth: {
    boxesSold: number;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  };
  lifetime: {
    revenue: number;
    profit: number;
  };
}

export type ReorderUrgency = 'urgent' | 'soon' | 'ok';

export interface MerchantReorderPrediction {
  merchantId: string;
  merchantName: string;
  estimatedRollsLeft: number;
  reorderInDays: number;
  urgency: ReorderUrgency;
}

export interface PaperRollData {
  inventory: PaperInventoryStats;
  revenue: PaperRevenueData;
  reorderPredictions: MerchantReorderPrediction[];
}

// Belt & Territory Management Types
export type BeltStatus = 'peak' | 'growing' | 'new' | 'inactive';

export interface BeltPerformance {
  beltId: string;
  beltName: string;
  executiveCount: number;
  merchantCount: number;
  salesPerMonth: number;
  status: BeltStatus;
}

export interface BeltMapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'active-merchant' | 'inactive-merchant' | 'visited-today' | 'executive';
  name: string;
  beltId?: string;
}

export interface BeltSaturation {
  beltId: string;
  beltName: string;
  merchantsAcquired: number;
  totalAddressable: number;
  saturationPercentage: number;
}

export interface BeltTerritoryData {
  belts: BeltPerformance[];
  mapMarkers: BeltMapMarker[];
  saturation: BeltSaturation[];
  totals: {
    executives: number;
    merchants: number;
    salesPerMonth: number;
  };
}

// Renewals & Subscriptions Types
export interface RenewalPeriod {
  period: string;
  merchantCount: number;
  potentialRevenue: number;
}

export interface RenewalPipeline {
  totalActiveMerchants: number;
  periods: RenewalPeriod[];
  totalPotentialRevenue: number;
  expectedRenewalRate: {
    min: number;
    max: number;
  };
  expectedRevenue: {
    min: number;
    max: number;
  };
}

export interface RenewalAction {
  trigger: string;
  method: string;
  description: string;
}

export interface RenewalData {
  pipeline: RenewalPipeline;
  actions: RenewalAction[];
}

// Reports & Downloads Types
export type ReportCategory = 'financial' | 'sales' | 'merchant' | 'inventory';

export interface Report {
  id: string;
  name: string;
  category: ReportCategory;
  format: 'excel' | 'pdf' | 'csv';
  description?: string;
}

// Settings Types
export interface CompanySettings {
  companyName: string;
  brandName: string;
  gstin: string;
  pan: string;
  address: string;
  helplineNumber: string;
  logoUrl?: string;
}

export interface PricingSettings {
  mrp: number;
  minimumPrice: number;
  renewalPrice: number;
  paperRollBundlePrice: number;
  paperRollBundleSize: number;
}

export interface CommissionTier {
  couponCode: string;
  pricePoint: number;
  commission: number;
}

export interface CommissionSettings {
  tiers: CommissionTier[];
  paperRollDeliveryCommission: number;
  bonusTiers: { sales: number; bonus: number }[];
}

export interface NotificationSettings {
  dailySummaryEmail: boolean;
  realtimeSaleAlert: boolean;
  churnRiskAlert: boolean;
  lowStockAlertThreshold: number;
  fakeGpsAlert: boolean;
  dailyRevenueSummaryTime: string;
}

export interface UserManagementItem {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: string;
}

export interface BeltManagementItem {
  beltId: string;
  beltName: string;
  boundaries?: string;
  assignedExecutives: string[];
}
