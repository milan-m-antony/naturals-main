import apiClient from './client';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export const inventoryService = {
  async getAll(params?: { status?: string; category?: string }): Promise<InventoryItem[]> {
    const response = await apiClient.get<InventoryItem[]>('/inventory', { params });
    return response.data;
  },

  async getById(id: number): Promise<InventoryItem> {
    const response = await apiClient.get<InventoryItem>(`/inventory/${id}`);
    return response.data;
  },

  async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await apiClient.post<{ item: InventoryItem }>('/inventory', data);
    return response.data.item;
  },

  async update(id: number, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await apiClient.put<{ item: InventoryItem }>(`/inventory/${id}`, data);
    return response.data.item;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/inventory/${id}`);
  },
};
