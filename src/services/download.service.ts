import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Report } from '../types';

export const downloadService = {
  // Get list of available reports
  async getReportsList(): Promise<Report[]> {
    const response = await api.get<Report[]>(API_ENDPOINTS.DOWNLOADS.LIST);
    return response.data;
  },

  // Download a specific report
  async downloadReport(reportId: string): Promise<Blob> {
    const response = await api.get(API_ENDPOINTS.DOWNLOADS.REPORT(reportId), {
      responseType: 'blob',
    });
    return response.data;
  },

  // Trigger report download
  triggerDownload(reportId: string, reportName: string): void {
    const url = API_ENDPOINTS.DOWNLOADS.REPORT(reportId);
    const link = document.createElement('a');
    link.href = url;
    link.download = reportName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
