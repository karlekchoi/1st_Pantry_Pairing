
import { GoogleGenAI, Type, Part } from "@google/genai";
import type { RecipeRecommendationResponse, AlcoholPairingResponse, IngredientDetail, IngredientAnalysisResponse } from '../types';
import { extractReceiptText } from './donutService';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash-preview-09-2025";

// 재시도 유틸리티 함수
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            
            // 503 에러나 UNAVAILABLE 상태인 경우에만 재시도
            const isRetryable = error?.code === 503 || 
                               error?.status === 'UNAVAILABLE' ||
                               error?.message?.includes('overloaded') ||
                               error?.message?.includes('try again');
            
            if (!isRetryable || attempt === maxRetries - 1) {
                throw error;
            }
            
            // Exponential backoff: 1초, 2초, 4초
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`재시도 중... (${attempt + 1}/${maxRetries}) ${delay}ms 후 재시도`);
            await sleep(delay);
        }
    }
    
    throw lastError;
};

// 에러 메시지 변환 함수
const getErrorMessage = (error: any): string => {
    if (error?.code === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('overloaded')) {
        return '서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.';
    }
    if (error?.code === 400 || error?.message?.includes('API key')) {
        return 'API 키가 유효하지 않습니다. 설정을 확인해주세요.';
    }
    if (error?.message) {
        return error.message;
    }
    return '알 수 없는 오류가 발생했습니다.';
};

const systemInstruction = `
You are a sophisticated food and alcohol pairing consultant with a "French Chic" minimalist aesthetic.

CORE RULES:
1. LANGUAGE: The title 'Pantry Pairing' is the ONLY allowed non-Korean title. All other content MUST be in Korean. Use English only if technically necessary (e.g. variable names).
2. TONE: Sophisticated, concise, essential information only.
3. DATA SOURCE: Do NOT use Google Search or external tools. Use your internal culinary knowledge for all recipes and pairings.
4. FORMAT: Strictly output JSON as requested.
`;

const ingredientDetailSchema = {
    type: Type.OBJECT,
    properties: {
        item: { type: Type.STRING },
        quantity: { type: Type.STRING },
        storage: { type: Type.STRING, enum: ['냉장', '냉동', '실온'] },
        expiration_date: { type: Type.STRING }
    },
    required: ["item", "quantity", "storage", "expiration_date"],
};

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    required_effort: { type: Type.STRING },
    cooking_summary: { type: Type.STRING, description: "A brief 1-2 sentence overview of the dish." },
    instructions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Step-by-step cooking instructions."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          measurement: { type: Type.STRING, description: "Precise quantity (e.g., 1Tbsp, 200g)" },
          is_missing: { type: Type.BOOLEAN },
          note: { type: Type.STRING },
        },
        required: ["item", "measurement", "is_missing"],
      },
    },
    alcohol_pairings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["name", "reason"],
      },
      description: "2-3 specific alcohol pairings tailored to this recipe's unique characteristics"
    },
  },
  required: ["name", "required_effort", "cooking_summary", "instructions", "ingredients", "alcohol_pairings"],
};

const recipeRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    request_type: { type: Type.STRING },
    input_ingredients_detail: {
      type: Type.ARRAY,
      items: ingredientDetailSchema
    },
    recipe_recommendations: {
      type: Type.ARRAY,
      items: recipeSchema,
    },
    alcohol_pairings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["name", "reason"],
      },
    },
  },
  required: ["request_type", "input_ingredients_detail", "recipe_recommendations", "alcohol_pairings"],
};

const ingredientAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        detected_ingredients: {
            type: Type.ARRAY,
            items: ingredientDetailSchema
        }
    },
    required: ["detected_ingredients"]
}

const pairingRecommendationItemSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        is_detailed_available: { type: Type.BOOLEAN },
        reason: { type: Type.STRING, description: "Brief explanation (1 sentence) why this food pairs well with the alcohol." }
    },
    required: ["id", "name", "is_detailed_available", "reason"]
};

const simplePairingItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        reason: { type: Type.STRING, description: "Brief explanation (1 sentence) why this food pairs well with the alcohol." }
    },
    required: ["name", "reason"]
}

const alcoholPairingSchema = {
    type: Type.OBJECT,
    properties: {
        request_type: { type: Type.STRING },
        selected_alcohol: { type: Type.STRING },
        recommendations: {
            type: Type.OBJECT,
            properties: {
                refrigerator_version: { 
                    type: Type.ARRAY, 
                    items: pairingRecommendationItemSchema
                },
                convenience_store_version: { type: Type.ARRAY, items: simplePairingItemSchema },
                delivery_version: { type: Type.ARRAY, items: simplePairingItemSchema },
            },
            required: ["refrigerator_version", "convenience_store_version", "delivery_version"],
        },
        detailed_popup_recipes: {
            type: Type.ARRAY,
            items: recipeSchema
        }
    },
    required: ["request_type", "selected_alcohol", "recommendations", "detailed_popup_recipes"],
};

export const analyzeImageIngredients = async (
    image: { mimeType: string; data: string }
): Promise<IngredientAnalysisResponse> => {
    let receiptText: string | null = null;
    
    // Try to extract text using Donut OCR first (for receipts)
    try {
        receiptText = await extractReceiptText(image);
        console.log("Donut extracted text:", receiptText);
    } catch (error) {
        console.warn("Donut OCR failed, falling back to Gemini vision:", error);
        // Continue with Gemini vision if Donut fails
    }
    
    // If we have extracted text from Donut, use it with Gemini for structured parsing
    // Otherwise, use Gemini vision directly
    const prompt = receiptText 
        ? `다음은 영수증에서 추출된 텍스트입니다:\n\n${receiptText}\n\n이 텍스트를 분석하여 식품 재료를 식별하세요. 각 재료에 대해 수량을 추정하고, 적절한 보관 위치('냉장', '냉동', 또는 '실온')를 결정하고, 일반적인 유통기한(YYYY-MM-DD 형식)을 추정하거나 알 수 없으면 'N/A'를 사용하세요. 모든 응답은 한국어로 작성하세요.`
        : `이 영수증이나 냉장고 이미지를 분석하세요. 
    보이는 모든 식품 재료를 식별하세요. 
    각 재료에 대해 수량을 추정하고, 적절한 보관 위치('냉장', '냉동', 또는 '실온')를 결정하고, 일반적인 유통기한(YYYY-MM-DD 형식)을 추정하거나 알 수 없으면 'N/A'를 사용하세요. 
    모든 응답은 한국어로 작성하세요.`;
    
    try {
        const response = await retryWithBackoff(async () => {
            return await ai.models.generateContent({
                model: model,
                contents: {
                    parts: receiptText 
                        ? [{ text: prompt }]  // Use text-only if we have Donut result
                        : [
                            { inlineData: image },
                            { text: prompt }
                        ]  // Use vision if Donut failed
                },
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: ingredientAnalysisSchema
                }
            });
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        return JSON.parse(jsonText) as IngredientAnalysisResponse;
    } catch (e: any) {
        console.error("Failed to analyze image:", e);
        const errorMessage = getErrorMessage(e);
        throw new Error(errorMessage || "분석 결과를 처리하는 중 오류가 발생했습니다.");
    }
}


export const getRecipeRecommendations = async (
  ingredients: IngredientDetail[]
): Promise<RecipeRecommendationResponse> => {
    const ingredientsJson = JSON.stringify(ingredients, null, 2);
    
    const prompt = `Based on this detailed list of my ingredients: ${ingredientsJson}. 
    1. Generate 3 COMPLETELY DIFFERENT recipes with DISTINCT flavors, cooking styles, and ingredient combinations. 
       - For each recipe, specify EXACT measurements (e.g. 15ml, 200g) for every ingredient.
       - Provide step-by-step cooking instructions in the 'instructions' array.
       - Mark ingredients not in the provided list as 'is_missing: true'. 
       - IMPORTANT: Recipe names should be simple and clean. Use only the actual dish name without unnecessary adjectives or descriptive words. 
         Examples: "참치 김치찌개" (not "얼큰한 콩나물 참치 김치찌개"), "된장찌개" (not "구수한 된장찌개"), "계란볶음밥" (not "부드러운 계란볶음밥").
       - Recipe names should NOT contain English words or characters.
       - Make sure the 3 recipes have COMPLETELY DIFFERENT flavor profiles (e.g., one spicy, one mild/creamy, one rich/hearty, one light/fresh, etc.)
       - Vary the main ingredients and cooking methods (e.g., stew, stir-fry, soup, grilled, etc.)
    
    2. CRITICAL - MOST IMPORTANT: For EACH recipe, recommend 2-3 UNIQUE alcohol pairings that are SPECIFICALLY tailored to THAT recipe's unique characteristics.
       - Each recipe MUST have COMPLETELY DIFFERENT alcohol recommendations. NO DUPLICATES across recipes.
       - Analyze each recipe's: flavor profile (spicy/mild/sweet/sour/umami), main ingredients, cooking method, richness level, temperature (hot/cold)
       - Match alcohols to each recipe's specific characteristics:
         * Spicy dishes → Pair with refreshing beers (카스, 하이트), light soju (참이슬 후레쉬), or sweet wines
         * Rich/heavy dishes → Pair with full-bodied wines, whiskey, or strong beers
         * Light/fresh dishes → Pair with white wines, light beers, or makgeolli
         * Seafood dishes → Pair with white wines, sake, or light beers
         * Meat dishes → Pair with red wines, whiskey, or dark beers
       - IMPORTANT: Recommend SPECIFIC BRAND NAMES and VARIETIES, not just generic types.
       - Vary alcohol CATEGORIES across recipes (e.g., Recipe 1: beer + soju, Recipe 2: wine + whiskey, Recipe 3: makgeolli + sake)
       
       Alcohol Categories and Specific Brands to Choose From (use DIFFERENT ones for each recipe):
       - Beer: 카스, 기네스, 하이네켄, 에델바이스, 호가든, 스텔라 아르투아, 크로넨부르크, 칼스버그, 버드와이저, 하이트, OB 라거, 카스 프레시, 테라, 클라우드, 아사히, 키린, 삿포로, 하이네켄 다크, 기네스 드래프트, 하이네켄 실버, 코로나, 하이네켄 0.0 등
       - Soju: 참이슬, 참이슬 후레쉬, 진로, 좋은데이, 처음처럼, 이슬톡톡, 한라산, 안동소주, 화요, 오비, 대선, 진로 이즈백, 참이슬 순, 진로 참이슬, 좋은데이 프리미엄 등
       - Whiskey: 조니 워커 블랙, 조니 워커 레드, 조니 워커 골드, 잭 다니엘, 짐빔, 크라운 로얄, 싱글몰트 위스키, 피트 위스키, 블렌디드 위스키, 맥켈란, 글렌피딕, 발렌타인, 시바스 리갈, 발렌타인 12년, 발렌타인 17년, 발렌타인 21년, 조니 워커 플래티넘, 잭 다니엘 허니 등
       - Wine: 카베르네 소비뇽, 메를로, 피노 누아, 샤르도네, 소비뇽 블랑, 리슬링, 샴페인, 프로세코, 모스카토, 피노 그리지오, 샤블리, 말벡, 시라, 피노 누아, 까베르네 프랑, 메를로, 피노 누아, 샤르도네, 소비뇽 블랑 등
       - Makgeolli: 서울 장수 생막걸리, 동동주, 이천쌀막걸리, 서울의 막걸리, 백세주, 문배주, 솔송주, 생막걸리, 탁주 등
       - Sake: 다이긴조, 준마이, 혼죠조, 쿠보타 만슈, 하쿠쓰루, 기쿠마사, 사케 등
       - Cocktails: 모히토, 마가리타, 올드 패션드, 위스키 사워, 진 토닉, 마티니, 블러디 메리, 마이타이 등
       - Other: 막걸리, 청주, 보드카, 럼, 진, 데킬라, 브랜디, 코냑 등
       
       - Always include the brand name or specific variety in the pairing name.
       - CRITICAL: Ensure Recipe 1, Recipe 2, and Recipe 3 have ZERO overlapping alcohol recommendations.
       - Consider the recipe's flavor intensity, spiciness, richness, main ingredients, and cooking method when selecting pairings.
       - Example: If Recipe 1 is spicy kimchi stew → recommend "카스" or "참이슬 후레쉬"
                 If Recipe 2 is mild soup → recommend "샤르도네" or "서울 장수 생막걸리"
                 If Recipe 3 is rich meat dish → recommend "조니 워커 블랙" or "카베르네 소비뇽"
    
    3. Echo back the provided ingredients.
    
    Rules:
    - Use your internal knowledge only.
    - Respond strictly in Korean.
    - No French except 'Pantry Pairing'.
    - Recipe names must be concise dish names only, no adjectives or English.
    - Alcohol pairings must include specific brand names or varieties, not just generic types.
    - MOST CRITICAL: Each of the 3 recipes MUST have COMPLETELY DIFFERENT alcohol pairings with ZERO overlap. This is the most important requirement.`;

    try {
        const response = await retryWithBackoff(async () => {
            return await ai.models.generateContent({
                model: model,
                contents: { parts: [{ text: prompt }] },
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: recipeRecommendationSchema,
                },
            });
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        return JSON.parse(jsonText) as RecipeRecommendationResponse;
    } catch (e: any) {
        console.error("Failed to get recipe recommendations:", e);
        const errorMessage = getErrorMessage(e);
        throw new Error(errorMessage || "레시피를 추천하는 중 오류가 발생했습니다.");
    }
};

export const getAlcoholPairings = async (
  alcohol: string,
  availableIngredients: string[]
): Promise<AlcoholPairingResponse> => {
    const prompt = `I want to drink ${alcohol}. Recommend food pairings in three categories based on your internal culinary knowledge.
    
    IMPORTANT: If the user searches for a generic alcohol type (like "맥주", "소주", "위스키", "와인"), you should suggest SPECIFIC BRAND NAMES and VARIETIES in your recommendations, not just repeat the generic type.
    
    Categories:
    1. 'refrigerator_version': Suggest EXACTLY 5 sophisticated dishes using these ingredients: [${availableIngredients.join(', ')}]. 
       - Generate a unique 'id' (e.g., "R01", "R02", "R03", "R04", "R05") for each.
       - Set 'is_detailed_available' to true.
       - Provide a 'reason' why this dish pairs well with ${alcohol}.
    2. 'convenience_store_version': Suggest EXACTLY 5 items easily found in a Korean convenience store.
       - Provide a 'reason' why this item pairs well.
    3. 'delivery_version': Suggest EXACTLY 5 delivery food options that pair well.
       - Provide a 'reason' why this food pairs well.
    
    Alcohol Brand Examples to Consider:
    - Beer: 카스, 기네스, 하이네켄, 에델바이스, 호가든, 스텔라 아르투아, 크로넨부르크, 칼스버그, 버드와이저, 하이트, OB 라거, 카스 프레시, 테라, 클라우드 등
    - Soju: 참이슬, 진로, 좋은데이, 처음처럼, 이슬톡톡, 한라산, 안동소주, 화요, 오비, 대선 등
    - Whiskey: 조니 워커 블랙/레드/골드, 잭 다니엘, 짐빔, 크라운 로얄, 싱글몰트 위스키, 피트 위스키, 블렌디드 위스키, 맥켈란, 글렌피딕, 발렌타인, 시바스 리갈 등
    - Wine: 카베르네 소비뇽, 메를로, 피노 누아, 샤르도네, 소비뇽 블랑, 리슬링, 샴페인, 프로세코, 모스카토, 피노 그리지오 등
    - Makgeolli: 막걸리, 동동주, 이천쌀막걸리, 서울의 막걸리, 백세주 등
    - Sake: 다이긴조, 준마이, 혼죠조, 쿠보타 만슈 등
    
    Crucial Step:
    For the 5 dishes in 'refrigerator_version', you MUST provide their full recipe details in the 'detailed_popup_recipes' array. 
    - Include exact measurements and step-by-step instructions.
    The 'id' in 'detailed_popup_recipes' must match the 'id' in 'refrigerator_version'.
    - Make sure to provide EXACTLY 5 recipes in 'detailed_popup_recipes'.
    
    Rules:
    - Respond strictly in Korean.
    - Do NOT use Google Search.
    - Provide detailed steps and ingredients for the popup recipes.
    - When recommending alcohol pairings, always suggest specific brand names or varieties, not just generic types.`;

    try {
        const response = await retryWithBackoff(async () => {
            return await ai.models.generateContent({
                model: model,
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: alcoholPairingSchema,
                },
            });
        });
        
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        return JSON.parse(jsonText) as AlcoholPairingResponse;
    } catch (e: any) {
        console.error("Failed to get alcohol pairings:", e);
        const errorMessage = getErrorMessage(e);
        throw new Error(errorMessage || "페어링을 추천하는 중 오류가 발생했습니다.");
    }
};