# API Alignment Summary

## ✅ All API Endpoints Have Been Aligned with Backend

### Changes Made:

## 1. **Updated API Endpoint Constants** ([src/utils/constants.ts](src/utils/constants.ts))

All endpoints now use the `/api` prefix and match the backend API specification:

- ✅ **Authentication**: `/api/auth/*` (send-otp, verify-otp, resend-otp, register, login)
- ✅ **Business/Customers**: `/api/business/*` (current, setup, update)
- ✅ **Subscriptions**: `/api/subscriptions/*` (current, start-trial, create, upgrade, billing-history)
- ✅ **Plans**: `/api/plans`
- ✅ **Payments**: `/api/payments/*` (create-order, verify)
- ✅ **Bills/Sales**: `/api/bills/*` (list, by ID, by number, date-range)
- ✅ **Invoices**: `/api/invoices/*`
- ✅ **Items**: `/api/items/*` (list, low-stock, fast-items)
- ✅ **Reports**: `/api/reports/*` (today-sales, monthly-sales, sales with date range, staff-performance)
- ✅ **User**: `/api/user/eligibility`

---

## 2. **Updated Service Files**

### [auth.service.ts](src/services/auth.service.ts)
**Added:**
- `sendOTP(phoneNumber)` - Send OTP for login
- `verifyOTP(phoneNumber, otp)` - Verify OTP code
- `resendOTP(phoneNumber)` - Resend OTP
- `register(registrationData)` - Register shop & owner

### [customer.service.ts](src/services/customer.service.ts)
**Changed:** Now uses `/api/business/*` endpoints (customers are business profiles)
**Added:**
- `getCurrentBusiness()` - Get current business details
- `setupBusiness(businessData)` - Setup new business profile
- `updateBusiness(businessData)` - Update business profile

### [subscription.service.ts](src/services/subscription.service.ts)
**Added:**
- `getCurrentSubscription()` - Get active subscription
- `startTrial(trialData)` - Start free trial
- `createSubscription(subscriptionData)` - Create paid subscription
- `upgradeSubscription(upgradeData)` - Upgrade plan
- `getBillingHistory()` - Get payment history
- `getPlanById(id)` - Get specific plan details

**Updated:**
- `getPlans(businessType?)` - Now supports filtering by KIRANA/RESTAURANT

### [sales.service.ts](src/services/sales.service.ts)
**Added:**
- `getBills(filters)` - Get all bills/invoices
- `getBillById(id)` - Get bill by ID
- `getBillByNumber(billNumber)` - Get bill by number
- `getBillsByDateRange(startDate, endDate)` - Get bills in date range

### [report.service.ts](src/services/report.service.ts)
**Added:**
- `getTodaySales()` - Sales summary for today
- `getMonthlySales()` - Sales summary for this month
- `getSalesByDateRange(startDate, endDate)` - Sales for selected period
- `getStaffPerformance(filters)` - Staff/salesperson performance (restaurant)
- `getSalesReport(filters)` - Sales report with filters

---

## 3. **New Service Files Created**

### [payment.service.ts](src/services/payment.service.ts) 🆕
- `createOrder(orderData)` - Create Razorpay order
- `verifyPayment(paymentData)` - Verify Razorpay payment

### [item.service.ts](src/services/item.service.ts) 🆕
- `getItems(filters)` - List all items for business
- `getLowStockItems()` - List low stock items
- `getFastMovingItems()` - List fast-moving items

### [user.service.ts](src/services/user.service.ts) 🆕
- `checkEligibility(businessType)` - Validate eligibility for plan upgrade/trial

---

## 4. **Key Alignment Points**

### ✅ Authentication Flow
- Now supports OTP-based login flow
- Registration endpoint available
- All auth endpoints use `/api/auth/*`

### ✅ Customers = Business Profiles
- `/api/business/current` replaces `/customers`
- Clear separation: business profile management vs customer listing

### ✅ Subscription Management
- Complete lifecycle: trial → create → upgrade
- Billing history available
- Current subscription endpoint

### ✅ Sales/Bills
- `/api/bills` replaces `/sales/performance`
- Date range filtering supported
- Bill lookup by ID and bill number

### ✅ Reports
- Today and monthly sales endpoints
- Custom date range reports
- Staff performance for restaurants
- All endpoints use `/api/reports/*`

### ✅ Plans & Payments
- Plans can be filtered by business type
- Razorpay integration endpoints ready

---

## 🔒 Important Notes

1. **JWT Required**: All endpoints except `/api/auth/*` require `Authorization: Bearer <token>`
2. **Role-Based Access**: OWNER/ADMIN/COORDINATOR roles only
3. **No Local Calculations**: Never calculate totals, expiry, etc. on frontend - use only API data
4. **Error Handling**: Show "Not Available" for missing data, "Access Denied" for 403 errors
5. **Pagination**: Check API response for pagination params and defaults

---

## 🎯 Next Steps

1. **Update Dashboard Components**: Use new service methods in Dashboard, Customers, Subscriptions pages
2. **Update Login Flow**: Implement OTP-based authentication
3. **Test API Calls**: Verify all endpoints return expected data
4. **Handle 401/403**: Ensure proper error handling and redirects
5. **Environment Variable**: Set `VITE_API_BASE_URL` to your backend URL

---

## 📝 API Documentation Reference

For complete request/response schemas, see:
- [API_CONTRACT.md](https://github.com/vishal2006/hisab-kitab-BE-v1/blob/main/API_CONTRACT.md)
- Backend source: [hisab-kitab-BE-v1](https://github.com/vishal2006/hisab-kitab-BE-v1)

---

**Status**: ✅ All API endpoints are now aligned with backend specification
