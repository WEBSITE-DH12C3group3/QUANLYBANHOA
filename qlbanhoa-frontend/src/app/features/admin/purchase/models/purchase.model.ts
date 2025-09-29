export type PurchaseOrderStatus = 'draft' | 'ordered' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  id?: number;
  productId: number;
  qty: number;
  unitCost: number;
  subtotal?: number;
}

export interface PurchaseOrder {
  id: number;
  code: string;
  supplierId: number;
  status: PurchaseOrderStatus;
  expectedDate?: string; // ISO date
  subtotal: number;
  discount: number;
  total: number;
  note?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderRequest {
  supplierId: number;
  expectedDate?: string; // ISO date
  note?: string;
  discount?: number;
  items: PurchaseOrderItem[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
