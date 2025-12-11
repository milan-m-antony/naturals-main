import apiClient from './apiClient';

export const analyticsService = {
  /**
   * Get revenue analytics with date range and period options
   */
  async getRevenueAnalytics(
    startDate?: string,
    endDate?: string,
    branchId?: number,
    period: string = 'daily'
  ) {
    try {
      const response = await apiClient.get('/analytics/revenue', {
        params: {
          start_date: startDate,
          end_date: endDate,
          branch_id: branchId,
          period,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  /**
   * Get staff performance analytics
   */
  async getStaffPerformance(
    startDate?: string,
    endDate?: string,
    branchId?: number,
    staffId?: number
  ) {
    try {
      const response = await apiClient.get('/analytics/staff-performance', {
        params: {
          start_date: startDate,
          end_date: endDate,
          branch_id: branchId,
          staff_id: staffId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching staff performance:', error);
      throw error;
    }
  },

  /**
   * Get service analytics (popularity, revenue, ratings)
   */
  async getServiceAnalytics(
    startDate?: string,
    endDate?: string,
    branchId?: number,
    limit: number = 20
  ) {
    try {
      const response = await apiClient.get('/analytics/services', {
        params: {
          start_date: startDate,
          end_date: endDate,
          branch_id: branchId,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching service analytics:', error);
      throw error;
    }
  },

  /**
   * Get customer insights and metrics
   */
  async getCustomerInsights(startDate?: string, endDate?: string) {
    try {
      const response = await apiClient.get('/analytics/customers', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer insights:', error);
      throw error;
    }
  },

  /**
   * Get appointment analytics (status breakdown, ratings, cancellation rate)
   */
  async getAppointmentAnalytics(startDate?: string, endDate?: string) {
    try {
      const response = await apiClient.get('/analytics/appointments', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment analytics:', error);
      throw error;
    }
  },

  /**
   * Get dashboard overview with key metrics
   */
  async getDashboardOverview() {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  /**
   * Generate a new report for export
   */
  async generateReport(
    reportType: string,
    format: 'pdf' | 'excel' | 'csv',
    startDate?: string,
    endDate?: string,
    branchId?: number,
    name?: string
  ) {
    try {
      const response = await apiClient.post('/reports', {
        report_type: reportType,
        format,
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        name,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  /**
   * Get report status and download link
   */
  async getReport(reportId: number) {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  /**
   * List all generated reports
   */
  async listReports(page: number = 1, perPage: number = 15, type?: string, status?: string) {
    try {
      const response = await apiClient.get('/reports', {
        params: {
          page,
          per_page: perPage,
          type,
          status,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  /**
   * Delete a report
   */
  async deleteReport(reportId: number) {
    try {
      const response = await apiClient.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },
};

export default analyticsService;
