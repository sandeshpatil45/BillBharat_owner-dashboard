# Quick Start Guide - Updated API Integration

## 🚀 Immediate Actions Required

### 1. Set Environment Variable
Create or update `.env` file in project root:
```env
VITE_API_BASE_URL=http://your-backend-url:8080
```

### 2. Install Dependencies (if needed)
```bash
npm install
```

### 3. Test API Connection
Update your backend URL and try these service calls:

```typescript
import { authService } from './services/auth.service';
import { reportService } from './services/report.service';
import { subscriptionService } from './services/subscription.service';

// Test authentication (OTP flow)
await authService.sendOTP('+91XXXXXXXXXX');
await authService.verifyOTP('+91XXXXXXXXXX', '123456');

// Test reports
const todaySales = await reportService.getTodaySales();
const monthlySales = await reportService.getMonthlySales();

// Test current subscription
const subscription = await subscriptionService.getCurrentSubscription();
```

---

## 📋 Component Updates Needed

### Dashboard Component
**File**: [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx)

Replace old API calls with:
```typescript
// Instead of custom endpoints
const todaySales = await reportService.getTodaySales();
const monthlySales = await reportService.getMonthlySales();
const currentBusiness = await customerService.getCurrentBusiness();
const subscription = await subscriptionService.getCurrentSubscription();
```

### Customers Page
**File**: [src/pages/Customers.tsx](src/pages/Customers.tsx)

Update to use business endpoints:
```typescript
// Get current business
const business = await customerService.getCurrentBusiness();

// Update business
await customerService.updateBusiness(businessData);
```

### Subscriptions Page
**File**: [src/pages/Subscriptions.tsx](src/pages/Subscriptions.tsx)

Use new subscription methods:
```typescript
// Current subscription
const subscription = await subscriptionService.getCurrentSubscription();

// Billing history
const history = await subscriptionService.getBillingHistory();

// Upgrade
await subscriptionService.upgradeSubscription({
  subscriptionId: 'sub_123',
  newPlanCode: 'PREMIUM'
});
```

### Sales Page
**File**: [src/pages/Sales.tsx](src/pages/Sales.tsx)

Use bills endpoints:
```typescript
// Get bills by date range
const bills = await salesService.getBillsByDateRange(
  '2026-01-01',
  '2026-01-23'
);

// For reports
const salesReport = await reportService.getSalesByDateRange(
  '2026-01-01',
  '2026-01-23'
);
```

### Login Page
**File**: [src/pages/Login.tsx](src/pages/Login.tsx)

Implement OTP flow:
```typescript
// Step 1: Send OTP
await authService.sendOTP(phoneNumber);

// Step 2: Verify OTP
const user = await authService.verifyOTP(phoneNumber, otpCode);

// Resend if needed
await authService.resendOTP(phoneNumber);
```

---

## 🛠️ New Features Available

### 1. Payment Integration
```typescript
import { paymentService } from './services/payment.service';

// Create Razorpay order
const order = await paymentService.createOrder({
  amount: 50000, // in paise
  currency: 'INR'
});

// After payment, verify
await paymentService.verifyPayment({
  razorpayOrderId: order.id,
  razorpayPaymentId: 'pay_xxx',
  razorpaySignature: 'signature_xxx'
});
```

### 2. Inventory Management
```typescript
import { itemService } from './services/item.service';

// Get low stock items
const lowStock = await itemService.getLowStockItems();

// Get fast-moving items
const fastMoving = await itemService.getFastMovingItems();
```

### 3. User Eligibility Check
```typescript
import { userService } from './services/user.service';

// Check eligibility for plan upgrade
const eligibility = await userService.checkEligibility('KIRANA');
```

---

## ⚠️ Breaking Changes to Address

### 1. Customer Listing
**Old**: `/customers` endpoint
**New**: `/api/business/current` for single business

If you need to list multiple businesses (admin view), check with backend for proper endpoint.

### 2. Sales Performance
**Old**: `/sales/performance`
**New**: `/api/bills` for raw bills data, or `/api/reports/sales` for aggregated reports

### 3. Authentication
**Old**: Direct login with credentials
**New**: OTP-based login flow (send → verify)

### 4. Subscription Actions
**Old**: Generic endpoints
**New**: Specific endpoints for trial, create, upgrade, billing history

---

## 🧪 Testing Checklist

- [ ] Environment variable set correctly
- [ ] Login with OTP works
- [ ] Dashboard loads today/monthly sales
- [ ] Current business profile loads
- [ ] Current subscription displays
- [ ] Plans list with filters
- [ ] Bills/invoices fetch by date range
- [ ] Reports generate correctly
- [ ] Error handling for 401/403
- [ ] "Not Available" shown for missing data

---

## 🐛 Common Issues & Fixes

### Issue: 401 Unauthorized
**Fix**: Check JWT token in localStorage and Authorization header

### Issue: 403 Forbidden
**Fix**: Verify user role is OWNER/ADMIN/COORDINATOR

### Issue: 404 Not Found
**Fix**: Ensure backend URL is correct and endpoints match exactly

### Issue: CORS Error
**Fix**: Configure CORS on backend to allow your frontend origin

---

## 📞 Support

If you encounter API errors:
1. Check browser console for exact error message
2. Verify backend is running and accessible
3. Check API_CONTRACT.md for request/response format
4. Ensure JWT token is valid and not expired

---

**Last Updated**: January 23, 2026
**Status**: ✅ All services updated and ready to use
