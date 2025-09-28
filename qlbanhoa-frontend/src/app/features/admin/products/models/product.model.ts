export interface Attribute {
  id: number;
  name: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';
}

export interface AttributeValueDTO {
  attributeId: number;
  valueText?: string | null;
  valueNum?: number | null;
  valueBool?: boolean | null;
  valueDate?: string | null; // ISO (yyyy-MM-dd)
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  categoryId?: number | null;
  unit?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  shortDesc?: string | null;
  description?: string | null;
  weightKg?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: AttributeValueDTO[];
}

export interface ProductRequest {
  sku: string;
  name: string;
  slug: string;
  categoryId?: number | null;
  unit?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  shortDesc?: string | null;
  description?: string | null;
  weightKg?: number | null;
  isActive?: boolean;
  attributes?: AttributeValueDTO[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
