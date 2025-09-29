export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  isActive: boolean;
  sortOrder: number;
  // for tree api:
  children?: Category[];
}

export interface CategoryRequest {
  name: string;
  slug?: string;
  parentId?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}