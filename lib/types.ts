export type CategoryId =
  | "macetas"
  | "hogar"
  | "organizadores"
  | "figuritas"
  | "personalizadas";

export type ProductFinish = "standard" | "hand-painted" | "ready-to-paint";
export type ProductFilamentType = "matte" | "marble" | "metallic" | "wood";

export type CustomPrint = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "inactive";
};

export type ProductColor = {
  name: string;
  hex?: string;
  type: ProductFilamentType | "multicolor";
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
  availableFilamentTypes?: ProductFilamentType[];
  availableFinishes?: ProductFinish[];
  finishOptions?: ProductFinishOption[];
  badge?: string;
  featured?: boolean;
  weightGrams: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
  color: string;
};
