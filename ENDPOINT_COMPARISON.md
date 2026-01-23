# API Endpoint Comparison - Before & After

## 🔄 Endpoint Mapping Table

| Feature | ❌ Old Endpoint | ✅ New Endpoint | Notes |
|---------|----------------|-----------------|-------|
| **Authentication** |
| Login | `/auth/login` | `/api/auth/login` | Added /api prefix |
| Send OTP | ❌ Not Available | `/api/auth/send-otp` | NEW |
| Verify OTP | ❌ Not Available | `/api/auth/verify-otp` | NEW |
| Resend OTP | ❌ Not Available | `/api/auth/resend-otp` | NEW |
| Register | ❌ Not Available | `/api/auth/register` | NEW |
| **Customers/Business** |
| List Customers | `/customers` | `/api/business/current` | Changed to business profile |
| Get Customer | `/customers/{id}` | `/api/business/{id}` | Changed to business endpoint |
| Setup Business | ❌ Not Available | `/api/business/setup` | NEW |
| Update Business | ❌ Not Available | `/api/business/update` | NEW |
| **Subscriptions** |
| Current Subscription | ❌ Not Available | `/api/subscriptions/current` | NEW |
| Start Trial | ❌ Not Available | `/api/subscriptions/start-trial` | NEW |
| Create Subscription | ❌ Not Available | `/api/subscriptions/create` | NEW |
| Upgrade Plan | ❌ Not Available | `/api/subscriptions/upgrade` | NEW |
| Billing History | ❌ Not Available | `/api/subscriptions/billing-history` | NEW |
| List Subscriptions | `/subscriptions` | `/api/subscriptions` | Added /api prefix |
| **Plans** |
| List Plans | `/plans` | `/api/plans` | Added /api prefix + filter support |
| Get Plan | ❌ Not Available | `/api/plans/{id}` | NEW |
| **Sales/Bills** |
| Sales Performance | `/sales/performance` | `/api/bills` | Changed to bills endpoint |
| Get Bill by ID | ❌ Not Available | `/api/bills/{id}` | NEW |
| Get Bill by Number | ❌ Not Available | `/api/bills/number/{billNumber}` | NEW |
| Bills by Date Range | ❌ Not Available | `/api/bills/date-range` | NEW |
| **Reports** |
| Today Sales | ❌ Not Available | `/api/reports/today-sales` | NEW |
| Monthly Sales | ❌ Not Available | `/api/reports/monthly-sales` | NEW |
| Sales by Date | ❌ Not Available | `/api/reports/sales?startDate=...&endDate=...` | NEW |
| Staff Performance | ❌ Not Available | `/restaurant/reports/staff` | NEW |
| Dashboard KPIs | `/reports/dashboard-kpis` | `/api/reports/dashboard-kpis` | Added /api prefix |
| Revenue | `/reports/revenue` | `/api/reports/revenue` | Added /api prefix |
| **Payments** |
| Create Order | ❌ Not Available | `/api/payments/create-order` | NEW |
| Verify Payment | ❌ Not Available | `/api/payments/verify` | NEW |
| **Items/Inventory** |
| List Items | ❌ Not Available | `/api/items` | NEW |
| Low Stock | ❌ Not Available | `/api/items/low-stock` | NEW |
| Fast Moving | ❌ Not Available | `/api/items/fast-items` | NEW |
| **User** |
| Check Eligibility | ❌ Not Available | `/api/user/eligibility` | NEW |

---

## 📊 Summary of Changes

### ✅ Added /api Prefix
All endpoints now consistently use `/api` prefix matching backend structure.

### 🆕 New Features Added
- **OTP Authentication Flow**: Complete OTP-based login (send → verify → resend)
- **Business Profile Management**: Setup and update business profiles
- **Subscription Lifecycle**: Trial, create, upgrade, billing history
- **Bills Management**: Full CRUD with date range filtering
- **Report Enhancements**: Today/monthly sales, date range reports, staff performance
- **Payment Integration**: Razorpay order creation and verification
- **Inventory Tracking**: Items, low stock, fast-moving items
- **User Eligibility**: Plan upgrade validation

### 🔧 Structure Improvements
- **Customers → Business**: Proper separation of business profiles vs customer data
- **Sales → Bills**: Clear distinction between billing data and sales reports
- **Role-Based Access**: Proper OWNER/ADMIN/COORDINATOR role handling
- **Date Range Support**: Consistent date filtering across reports and bills

---

## 🎯 Impact on Application

### High Priority Updates Needed
1. **Login Page**: Implement OTP flow
2. **Dashboard**: Use new today-sales and monthly-sales endpoints
3. **Customers Page**: Switch to business profile endpoints
4. **Subscriptions Page**: Use new subscription lifecycle methods

### Medium Priority Updates
1. **Sales Page**: Migrate to bills endpoints
2. **Reports Page**: Use new date range report methods
3. **Settings Page**: Add business profile update

### Low Priority (Optional)
1. **Payments**: Integrate Razorpay if needed
2. **Inventory**: Show low stock/fast-moving items
3. **Staff Performance**: Restaurant-specific reports

---

## 🔐 Security & Best Practices

### Before
```typescript
// Old approach - inconsistent endpoints
api.get('/customers');
api.get('/sales/performance');
api.get('/reports/dashboard-kpis');
```

### After
```typescript
// New approach - consistent /api prefix, proper services
customerService.getCurrentBusiness();
salesService.getBills();
reportService.getTodaySales();
```

### JWT Handling
All non-auth endpoints now require:
```
Authorization: Bearer <token>
```
Handled automatically by axios interceptor in [api.ts](src/services/api.ts).

---

## 📈 Migration Path

### Phase 1: Core Features (Today)
- ✅ Update all service files
- ✅ Update constants with new endpoints
- ✅ Create new service files (payment, item, user)

### Phase 2: UI Updates (Next)
- Update Login page for OTP
- Update Dashboard with new report endpoints
- Update Customers page with business endpoints

### Phase 3: New Features (Later)
- Implement payment integration
- Add inventory management
- Add staff performance reports

---

**Migration Status**: ✅ Backend alignment complete
**Next Step**: Update UI components to use new service methods
