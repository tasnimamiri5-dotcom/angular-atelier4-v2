
export interface Category {
  id: number;
  name: string;
  products_count?: number;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}
