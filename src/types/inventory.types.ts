export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Critical';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: InventoryStatus;
  threshold: number;
}

export interface UpdateInventoryDto {
  id: number;
  stock: number;
}
