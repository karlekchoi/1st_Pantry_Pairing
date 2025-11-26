
export interface Ingredient {
  item: string;
  measurement: string;
  is_missing: boolean;
  note?: string;
}

export type StorageLocation = '냉장' | '냉동' | '실온';

export interface IngredientDetail {
  item: string;
  quantity: string;
  storage: StorageLocation;
  expiration_date: string; // YYYY-MM-DD or N/A
}

export interface Recipe {
  id?: string; // Added optional ID for linking
  name: string;
  required_effort: string;
  cooking_summary: string;
  instructions: string[]; // Detailed step-by-step instructions
  ingredients: Ingredient[];
  alcohol_pairings?: AlcoholPairingInfo[]; // Optional: specific pairings for this recipe
}

export type BookmarkStatus = 'wishlist' | 'completed';

export interface BookmarkedRecipe extends Recipe {
  status: BookmarkStatus;
  tags: string[];
  savedAt: string;
}

export interface AlcoholPairingInfo {
  name: string;
  reason: string;
}

export interface RecipeRecommendationResponse {
  request_type: "Recipe_Recommendation";
  input_ingredients_detail: IngredientDetail[];
  recipe_recommendations: Recipe[];
  alcohol_pairings: AlcoholPairingInfo[];
}

export interface IngredientAnalysisResponse {
    detected_ingredients: IngredientDetail[];
}

export interface PairingRecommendationItem {
  id: string;
  name: string;
  is_detailed_available: boolean;
  reason: string;
}

export interface SimplePairingItem {
  name: string;
  reason: string;
}

export interface AlcoholPairingRecommendations {
  refrigerator_version: PairingRecommendationItem[];
  convenience_store_version: SimplePairingItem[];
  delivery_version: SimplePairingItem[];
}

export interface AlcoholPairingResponse {
  request_type: "Alcohol_Pairing";
  selected_alcohol: string;
  recommendations: AlcoholPairingRecommendations;
  detailed_popup_recipes: Recipe[];
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: 'recipe' | 'pairing';
  author: string;
  createdAt: string;
  likes: number;
}

export type Tab = 'refrigerator' | 'recipe' | 'bookmark' | 'pairing' | 'shopping';