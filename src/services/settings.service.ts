import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  CompanySettings,
  PricingSettings,
  CommissionSettings,
  NotificationSettings,
  UserManagementItem,
  BeltManagementItem,
} from '../types';

export const settingsService = {
  // Company Settings
  async getCompanySettings(): Promise<CompanySettings> {
    const response = await api.get<CompanySettings>(API_ENDPOINTS.SETTINGS.COMPANY);
    return response.data;
  },

  async updateCompanySettings(settings: CompanySettings): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>(
      API_ENDPOINTS.SETTINGS.COMPANY,
      settings
    );
    return response.data;
  },

  // Pricing Settings
  async getPricingSettings(): Promise<PricingSettings> {
    const response = await api.get<PricingSettings>(API_ENDPOINTS.SETTINGS.PRICING);
    return response.data;
  },

  async updatePricingSettings(settings: PricingSettings): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>(
      API_ENDPOINTS.SETTINGS.PRICING,
      settings
    );
    return response.data;
  },

  // Commission Settings
  async getCommissionSettings(): Promise<CommissionSettings> {
    const response = await api.get<CommissionSettings>(API_ENDPOINTS.SETTINGS.COMMISSION);
    return response.data;
  },

  async updateCommissionSettings(settings: CommissionSettings): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>(
      API_ENDPOINTS.SETTINGS.COMMISSION,
      settings
    );
    return response.data;
  },

  // Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await api.get<NotificationSettings>(API_ENDPOINTS.SETTINGS.NOTIFICATIONS);
    return response.data;
  },

  async updateNotificationSettings(
    settings: NotificationSettings
  ): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS,
      settings
    );
    return response.data;
  },

  // User Management
  async getUsers(): Promise<UserManagementItem[]> {
    const response = await api.get<UserManagementItem[]>(API_ENDPOINTS.SETTINGS.USERS);
    return response.data;
  },

  async addUser(user: Partial<UserManagementItem>): Promise<{ success: boolean; userId: string }> {
    const response = await api.post<{ success: boolean; userId: string }>(
      API_ENDPOINTS.SETTINGS.USERS,
      user
    );
    return response.data;
  },

  async deactivateUser(userId: string): Promise<{ success: boolean }> {
    const response = await api.delete<{ success: boolean }>(
      `${API_ENDPOINTS.SETTINGS.USERS}/${userId}`
    );
    return response.data;
  },

  async resetPassword(userId: string): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(
      `${API_ENDPOINTS.SETTINGS.USERS}/${userId}/reset-password`
    );
    return response.data;
  },

  // Belt Management
  async getBelts(): Promise<BeltManagementItem[]> {
    const response = await api.get<BeltManagementItem[]>(
      API_ENDPOINTS.SETTINGS.BELTS_MANAGEMENT
    );
    return response.data;
  },

  async addBelt(belt: Partial<BeltManagementItem>): Promise<{ success: boolean; beltId: string }> {
    const response = await api.post<{ success: boolean; beltId: string }>(
      API_ENDPOINTS.SETTINGS.BELTS_MANAGEMENT,
      belt
    );
    return response.data;
  },

  async updateBelt(
    beltId: string,
    belt: Partial<BeltManagementItem>
  ): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>(
      `${API_ENDPOINTS.SETTINGS.BELTS_MANAGEMENT}/${beltId}`,
      belt
    );
    return response.data;
  },
};
