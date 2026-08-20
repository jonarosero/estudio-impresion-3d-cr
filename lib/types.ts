export type CategoryId =
  | "macetas"
  | "hogar"
  | "organizadores"
  | "figuritas"
  | "personalizadas";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: CategoryId;
  price: number;
  compareAtPrice?: number;
  image: string;
  colors: string[];
  badge?: string;
  featured?: boolean;
  stock: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
  color: string;
};
