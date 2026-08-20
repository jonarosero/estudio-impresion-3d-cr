export type CategoryId =
  | "macetas"
  | "hogar"
  | "organizadores"
  | "figuritas"
  | "personalizadas";

export type ProductFinish = "standard" | "hand-painted" | "ready-to-paint";

export type ProductColor = {
  name: string;
  type: "matte" | "marble" | "multicolor";
  price: number;
  image: string;
};

export type ProductFinishOption = {
  id: ProductFinish;
  title: string;
  description: string;
  priceAdjustment: number;
  image: string;
};

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
  colorVariants?: ProductColor[];
  colorPresentation?: "single" | "multicolor";
  availableFinishes?: ProductFinish[];
  finishOptions?: ProductFinishOption[];
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
