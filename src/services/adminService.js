import { api } from './api';

export const adminService = {
  // Cập nhật trạng thái đơn đăng ký thợ mộc
  updateWoodworkerStatus: async (woodworkerId, status, description = '') => {
    try {
      const response = await api.put('/api/v1/ww/ww-update-status', {
        woodworkerId: woodworkerId,
        status: status === 'APPROVED', // Chuyển thành boolean
        description: description
      });
      return response.data;
    } catch (error) {
      console.error('Update woodworker status error:', error);
      throw error;
    }
  },

  // Lấy danh sách đơn đăng ký thợ mộc
  getWoodworkerRegistrations: async () => {
    try {
      const response = await api.get('/api/v1/ww/inactive');
      return response.data;
    } catch (error) {
      console.error('Get woodworker registrations error:', error);
      throw error;
    }
  }
}; 