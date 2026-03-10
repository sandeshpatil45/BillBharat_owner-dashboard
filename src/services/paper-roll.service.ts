import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  PaperRollData,
  PaperInventoryStats,
  PaperRevenueData,
  MerchantReorderPrediction,
} from '../types';

export const paperRollService = {
  // Get paper roll overview data
  async getPaperRollData(): Promise<PaperRollData> {
    const response = await api.get<PaperRollData>(API_ENDPOINTS.PAPER_ROLLS.DATA);
    return response.data;
  },

  // Get paper inventory status
  async getInventory(): Promise<PaperInventoryStats> {
    const response = await api.get<PaperInventoryStats>(API_ENDPOINTS.PAPER_ROLLS.INVENTORY);
    return response.data;
  },

  // Get paper revenue data
  async getRevenue(): Promise<PaperRevenueData> {
    const response = await api.get<PaperRevenueData>(API_ENDPOINTS.PAPER_ROLLS.REVENUE);
    return response.data;
  },

  // Get merchant reorder predictions
  async getReorderPredictions(): Promise<MerchantReorderPrediction[]> {
    const response = await api.get<MerchantReorderPrediction[]>(
      API_ENDPOINTS.PAPER_ROLLS.REORDER_PREDICTIONS
    );
    return response.data;
  },

  // Send bulk WhatsApp to urgent merchants
  async sendBulkWhatsApp(merchantIds: string[]): Promise<{ success: boolean; sent: number }> {
    const response = await api.post<{ success: boolean; sent: number }>(
      '/api/paper-rolls/send-bulk-whatsapp',
      { merchantIds }
    );
    return response.data;
  },
};
