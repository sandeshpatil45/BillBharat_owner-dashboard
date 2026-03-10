import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockResetIcon from '@mui/icons-material/LockReset';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../components/layout/Layout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { settingsService } from '../services/settings.service';
import type { 
  CompanySettings, 
  PricingSettings, 
  CommissionSettings, 
  NotificationSettings,
  UserManagementItem,
  BeltManagementItem 
} from '../types';

// Fallback data
const FALLBACK_COMPANY: CompanySettings = {
  companyName: 'HisabKitab Pvt Ltd',
  gstin: '27AABCH1234F1Z5',
  pan: 'AABCH1234F',
  address: '123 Tech Park, Mumbai',
  helpline: '+91-9876543210',
  logoUrl: '',
};

const FALLBACK_PRICING: PricingSettings = {
  printerMRP: 7999,
  printerMin: 5499,
  renewalPrice: 1999,
  paperRollPrice: 900,
};

const FALLBACK_COMMISSION: CommissionSettings = {
  tiers: [
    { couponCode: 'ZERO', commissionPercentage: 0 },
    { couponCode: 'NEW500', commissionPercentage: 5 },
    { couponCode: 'NEW1000', commissionPercentage: 10 },
    { couponCode: 'STD', commissionPercentage: 15 },
  ],
  paperDeliveryBonus: 50,
  bonusTiers: [
    { salesTarget: 10, bonusAmount: 2000 },
    { salesTarget: 20, bonusAmount: 5000 },
    { salesTarget: 30, bonusAmount: 10000 },
  ],
};

const FALLBACK_NOTIFICATIONS: NotificationSettings = {
  dailyEmailReport: true,
  saleAlerts: true,
  churnAlerts: false,
  lowStockThreshold: true,
  fakeGPSAlerts: true,
  revenueSummaryTime: '09:00',
};

const FALLBACK_USERS: UserManagementItem[] = [
  { id: 1, name: 'Rajesh Kumar', role: 'team_lead', phone: '+91-9876543210', status: 'active', lastLogin: '2025-04-15 10:30 AM' },
  { id: 2, name: 'Priya Sharma', role: 'executive', phone: '+91-9876543211', status: 'active', lastLogin: '2025-04-15 09:15 AM' },
  { id: 3, name: 'Amit Singh', role: 'executive', phone: '+91-9876543212', status: 'inactive', lastLogin: '2025-04-10 02:30 PM' },
];

const FALLBACK_BELTS: BeltManagementItem[] = [
  { id: 1, beltName: 'Andheri West', assignedExecutive: 'Priya Sharma', totalMerchants: 45 },
  { id: 2, beltName: 'Bandra East', assignedExecutive: 'Amit Singh', totalMerchants: 38 },
  { id: 3, beltName: 'Borivali', assignedExecutive: 'Unassigned', totalMerchants: 0 },
];

const SettingsAdmin: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Company settings
  const [company, setCompany] = useState<CompanySettings>(FALLBACK_COMPANY);
  
  // Pricing settings
  const [pricing, setPricing] = useState<PricingSettings>(FALLBACK_PRICING);
  
  // Commission settings
  const [commission, setCommission] = useState<CommissionSettings>(FALLBACK_COMMISSION);
  
  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>(FALLBACK_NOTIFICATIONS);
  
  // User management
  const [users, setUsers] = useState<UserManagementItem[]>(FALLBACK_USERS);
  
  // Belt management
  const [belts, setBelts] = useState<BeltManagementItem[]>(FALLBACK_BELTS);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [companyData, pricingData, commissionData, notificationData, usersData, beltsData] = await Promise.all([
        settingsService.getCompanySettings(),
        settingsService.getPricingSettings(),
        settingsService.getCommissionSettings(),
        settingsService.getNotificationSettings(),
        settingsService.getUsers(),
        settingsService.getBelts(),
      ]);
      
      setCompany(companyData);
      setPricing(pricingData);
      setCommission(commissionData);
      setNotifications(notificationData);
      setUsers(usersData);
      setBelts(beltsData);
    } catch {
      // Fallback data already set
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      await settingsService.updateCompanySettings(company);
      setSuccess('Company settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePricing = async () => {
    setSaving(true);
    try {
      await settingsService.updatePricingSettings(pricing);
      setSuccess('Pricing settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCommission = async () => {
    setSaving(true);
    try {
      await settingsService.updateCommissionSettings(commission);
      setSuccess('Commission settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await settingsService.updateNotificationSettings(notifications);
      setSuccess('Notification settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (userId: number) => {
    if (!confirm('Send password reset link to this user?')) return;
    
    try {
      await settingsService.resetPassword(userId);
      alert('Password reset link sent to user');
    } catch (error: any) {
      alert(error.message || 'Failed to reset password');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      await settingsService.deactivateUser(userId);
      await fetchData();
      alert('User deactivated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to deactivate user');
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton type="table" />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          ⚙️ Settings & Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage company settings, pricing, commissions, users, and notifications
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Accordion Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        {/* 1. COMPANY SETTINGS */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🏢 Company Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={company.companyName}
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GSTIN"
                  value={company.gstin}
                  onChange={(e) => setCompany({ ...company, gstin: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PAN"
                  value={company.pan}
                  onChange={(e) => setCompany({ ...company, pan: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Helpline Number"
                  value={company.helpline}
                  onChange={(e) => setCompany({ ...company, helpline: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleSaveCompany} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Company Settings'}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 2. PRICING SETTINGS */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              💰 Pricing Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Printer MRP"
                  type="number"
                  value={pricing.printerMRP}
                  onChange={(e) => setPricing({ ...pricing, printerMRP: Number(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Selling Price"
                  type="number"
                  value={pricing.printerMin}
                  onChange={(e) => setPricing({ ...pricing, printerMin: Number(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Annual Renewal Price"
                  type="number"
                  value={pricing.renewalPrice}
                  onChange={(e) => setPricing({ ...pricing, renewalPrice: Number(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Paper Roll Price (per box)"
                  type="number"
                  value={pricing.paperRollPrice}
                  onChange={(e) => setPricing({ ...pricing, paperRollPrice: Number(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleSavePricing} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Pricing Settings'}
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 3. COMMISSION SETTINGS */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              📊 Commission Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Commission Tiers
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Coupon Code</TableCell>
                      <TableCell>Commission %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commission.tiers.map((tier, index) => (
                      <TableRow key={index}>
                        <TableCell>{tier.couponCode}</TableCell>
                        <TableCell>{tier.commissionPercentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Paper Delivery Bonus"
                    type="number"
                    value={commission.paperDeliveryBonus}
                    onChange={(e) => setCommission({ ...commission, paperDeliveryBonus: Number(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Bonus Tiers
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sales Target</TableCell>
                      <TableCell>Bonus Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commission.bonusTiers.map((tier, index) => (
                      <TableRow key={index}>
                        <TableCell>{tier.salesTarget} printers</TableCell>
                        <TableCell>₹{tier.bonusAmount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={handleSaveCommission} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Commission Settings'}
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 4. USER MANAGEMENT */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              👥 User Management
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="contained" startIcon={<PersonAddIcon />}>
                  Add Team Lead
                </Button>
                <Button variant="outlined" startIcon={<PersonAddIcon />}>
                  Add Executive
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              background: user.role === 'team_lead' ? '#dcfce7' : '#dbeafe',
                              color: user.role === 'team_lead' ? '#16a34a' : '#3b82f6',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {user.role === 'team_lead' ? 'Team Lead' : 'Executive'}
                          </Box>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              background: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                              color: user.status === 'active' ? '#16a34a' : '#dc2626',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {user.status}
                          </Box>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleResetPassword(user.id)} title="Reset Password">
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeactivateUser(user.id)}
                            disabled={user.status === 'inactive'}
                            title="Deactivate User"
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 5. BELT MANAGEMENT */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🗺️ Belt Management
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>
                Add New Belt
              </Button>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Belt Name</TableCell>
                      <TableCell>Assigned Executive</TableCell>
                      <TableCell>Total Merchants</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {belts.map((belt) => (
                      <TableRow key={belt.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{belt.beltName}</TableCell>
                        <TableCell>
                          {belt.assignedExecutive === 'Unassigned' ? (
                            <Typography variant="body2" color="text.secondary">
                              Unassigned
                            </Typography>
                          ) : (
                            belt.assignedExecutive
                          )}
                        </TableCell>
                        <TableCell>{belt.totalMerchants}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" title="Edit Belt">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 6. NOTIFICATION SETTINGS */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🔔 Notification Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.dailyEmailReport}
                        onChange={(e) => setNotifications({ ...notifications, dailyEmailReport: e.target.checked })}
                      />
                    }
                    label="Daily Email Report (sent at 9 AM)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.saleAlerts}
                        onChange={(e) => setNotifications({ ...notifications, saleAlerts: e.target.checked })}
                      />
                    }
                    label="Real-time Sale Alerts (WhatsApp + Email)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.churnAlerts}
                        onChange={(e) => setNotifications({ ...notifications, churnAlerts: e.target.checked })}
                      />
                    }
                    label="Churn Risk Alerts (weekly summary)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.lowStockThreshold}
                        onChange={(e) => setNotifications({ ...notifications, lowStockThreshold: e.target.checked })}
                      />
                    }
                    label="Low Stock Alerts (when printers < 10)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.fakeGPSAlerts}
                        onChange={(e) => setNotifications({ ...notifications, fakeGPSAlerts: e.target.checked })}
                      />
                    }
                    label="Fake GPS Alerts (immediate notification)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Revenue Summary Time"
                    type="time"
                    value={notifications.revenueSummaryTime}
                    onChange={(e) => setNotifications({ ...notifications, revenueSummaryTime: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

      </Box>
    </Layout>
  );
};

export default SettingsAdmin;
