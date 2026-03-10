import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  PrinterDeviceData,
  PrinterStats,
  PrinterLocationPoint,
  PrinterInventory,
  MACRegistryEntry,
  PrinterFilters,
} from '../types';

export const printerService = {
  // Get printer overview data
  async getPrinterData(): Promise<PrinterDeviceData> {
    const response = await api.get<PrinterDeviceData>(API_ENDPOINTS.PRINTERS.DATA);
    return response.data;
  },

  // Get printer location points for map
  async getPrinterLocations(filters?: PrinterFilters): Promise<PrinterLocationPoint[]> {
    const response = await api.get<PrinterLocationPoint[]>(API_ENDPOINTS.PRINTERS.LOCATIONS, {
      params: filters,
    });
    return response.data;
  },

  // Get printer inventory status
  async getPrinterInventory(): Promise<PrinterInventory> {
    const response = await api.get<PrinterInventory>(API_ENDPOINTS.PRINTERS.INVENTORY);
    return response.data;
  },

  // Get MAC address registry
  async getMACRegistry(filters?: PrinterFilters): Promise<{ data: MACRegistryEntry[]; total: number }> {
    const response = await api.get<{ data: MACRegistryEntry[]; total: number }>(
      API_ENDPOINTS.PRINTERS.MAC_REGISTRY,
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Place supplier order (future implementation)
  async placeSupplierOrder(quantity: number): Promise<{ success: boolean; orderId: string }> {
    const response = await api.post<{ success: boolean; orderId: string }>(
      '/api/printers/order',
      { quantity }
    );
    return response.data;
  },
};
