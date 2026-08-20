export type CategoryId =
  | "macetas"
  | "hogar"
  | "organizadores"
  | "figuritas"
  | "personalizadas";

export type ProductFinish = "standard" | "hand-painted" | "ready-to-paint";

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
  colorPresentation?: "single" | "multicolor";
  availableFinishes?: ProductFinish[];
  badge?: string;
  featured?: boolean;
  stock: number;
  weightGrams: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
  color: string;
};
