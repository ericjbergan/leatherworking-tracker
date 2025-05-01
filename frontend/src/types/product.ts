export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  images?: Array<{
    key: string;
    url: string;
    uploadedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
} 