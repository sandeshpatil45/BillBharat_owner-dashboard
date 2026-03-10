import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  BeltTerritoryData,
  BeltPerformance,
  BeltMapMarker,
  BeltSaturation,
} from '../types';

export const beltService = {
  // Get belt territory overview data
  async getBeltTerritoryData(): Promise<BeltTerritoryData> {
    const response = await api.get<BeltTerritoryData>(API_ENDPOINTS.BELTS.DATA);
    return response.data;
  },

  // Get belt performance data
  async getBeltPerformance(): Promise<BeltPerformance[]> {
    const response = await api.get<BeltPerformance[]>(API_ENDPOINTS.BELTS.PERFORMANCE);
    return response.data;
  },

  // Get map markers for belts
  async getMapMarkers(): Promise<BeltMapMarker[]> {
    const response = await api.get<BeltMapMarker[]>(API_ENDPOINTS.BELTS.MAP_MARKERS);
    return response.data;
  },

  // Get belt saturation data
  async getBeltSaturation(): Promise<BeltSaturation[]> {
    const response = await api.get<BeltSaturation[]>(API_ENDPOINTS.BELTS.SATURATION);
    return response.data;
  },
};
