export type ClothingCategory = "Tops" | "Bottoms" | "Shoes" | "Outerwear" | "Accessories";

export type WardrobeItem = {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory: string;
  color: string;
  pattern: string;
  material: string;
  season: string[];
  formality: string;
  occasions: string[];
  brand?: string;
  notes?: string;
  image: string;
  favorite: boolean;
  addedAt: string;
};

export type Outfit = {
  id: string;
  name: string;
  occasion: string;
  style: string;
  reason: string;
  itemIds: string[];
  image: string;
  updatedLabel: string;
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};
