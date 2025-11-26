import React, { useState } from 'react';
import type { RecipeRecommendationResponse, Recipe, IngredientDetail, BookmarkedRecipe } from '../types';
import { CheckIcon, ShoppingCartIcon, BookmarkIcon, SparklesIcon, CartPlusIcon, XMarkIcon, DiceIcon } from './Icons';
import RecipeLoader from './RecipeLoader';

interface RecipeTabProps {
  data: RecipeRecommendationResponse | null;
  ingredients: IngredientDetail[];
  onGetRecommendations: (ingredients: IngredientDetail[]) => void;
  bookmarks: BookmarkedRecipe[];
  onToggleBookmark: (recipe: Recipe) => void;
  isLoading: boolean;
  onAddToCart: (item: string) => void;
  shoppingList: string[];
}

const RecipeTab: React.FC<RecipeTabProps> = ({ data, ingredients, onGetRecommendations, bookmarks, onToggleBookmark, isLoading, onAddToCart, shoppingList }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(new Set());
  const [expandedPairings, setExpandedPairings] = useState<Set<string>>(new Set());
  
  const isBookmarked = (recipe: Recipe) => {
      return bookmarks.some(b => b.name === recipe.name);
  };

  const toggleRecipeExpansion = (index: number) => {
    const newExpanded = new Set(expandedRecipes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRecipes(newExpanded);
  };

  const togglePairingExpansion = (recipeIndex: number, pairingIndex: number) => {
    const key = `${recipeIndex}-${pairingIndex}`;
    const newExpanded = new Set(expandedPairings);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedPairings(newExpanded);
  };

  const handleAddToCart = (item: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(item);
  };

  if (isLoading && !data) {
      return <RecipeLoader />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
        <div className="bg-neutral-50 p-6 rounded-full mb-6">
            <SparklesIcon className="w-8 h-8 text-neutral-400" />
        </div>
        <h2 className="text-xl font-medium text-center mb-2">오늘의 추천 레시피</h2>
        <p className="text-neutral-500 text-center mb-8 max-w-xs mx-auto">
            팬트리에 있는 {ingredients.length}개의 재료를 분석하여<br/>
            최고의 레시피를 제안해드립니다.
        </p>
        
        <button 
            onClick={() => onGetRecommendations(ingredients)}
            disabled={ingredients.length === 0 || isLoading}
            className="bg-neutral-900 text-white px-8 py-4 rounded-full hover:bg-black disabled:bg-neutral-300 transition-all shadow-lg font-bold flex items-center gap-2"
        >
            <SparklesIcon className="w-5 h-5" />
            <span>레시피 추천 받기</span>
        </button>
        
        {ingredients.length === 0 && (
            <p className="text-xs text-red-400 mt-4">
                * 팬트리 탭에서 먼저 재료를 추가해주세요.
            </p>
        )}
      </div>
    );
  }

  const handleRandomSelect = () => {
    if (!data || data.recipe_recommendations.length === 0) return;
    const randomIndex = Math.floor(Math.random() * data.recipe_recommendations.length);
    const randomRecipe = data.recipe_recommendations[randomIndex];
    setSelectedRecipe(randomRecipe);
  };

  return (
    <div className="w-full animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-light text-neutral-900">추천 레시피</h2>
            <p className="text-neutral-500 mt-1 text-sm">팬트리 재료를 활용한 맞춤 메뉴</p>
        </div>
        <div className="flex items-center gap-4 self-end md:self-auto">
          {data && data.recipe_recommendations.length > 0 && (
            <button
              onClick={handleRandomSelect}
              className="flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              title="랜덤 선택"
            >
              <DiceIcon className="w-6 h-6" />
              <span className="text-xs font-semibold">랜덤 선택</span>
            </button>
          )}
          <div className="relative inline-block">
            <button 
                onClick={() => onGetRecommendations(ingredients)}
                disabled={isLoading}
                className="text-sm font-bold underline decoration-1 underline-offset-4 hover:text-neutral-600 disabled:text-neutral-300 relative z-10"
            >
                {isLoading ? '생성 중...' : '다른 레시피 보기'}
            </button>
            {isLoading && (
              <>
                <style>{`
                  @keyframes fairyOrbit {
                    0% {
                      transform: translate(-50%, -50%) rotate(0deg) translateX(60px) rotate(0deg);
                    }
                    100% {
                      transform: translate(-50%, -50%) rotate(360deg) translateX(60px) rotate(-360deg);
                    }
                  }
                  
                  @keyframes wingFlap {
                    0%, 100% {
                      transform: scaleY(1);
                    }
                    50% {
                      transform: scaleY(0.85);
                    }
                  }
                  
                  .fairy {
                    animation: fairyOrbit 5s ease-in-out infinite;
                    pointer-events: none;
                  }
                  
                  .fairy-wings {
                    animation: wingFlap 0.3s ease-in-out infinite;
                    transform-origin: center;
                  }
                `}</style>
                <div className="absolute left-1/2 top-1/2 fairy">
                  {/* 요정 (팅커벨 스타일 - 한 명이 나무 주위를 맴돌듯) */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                    {/* 머리 (사람 피부색, 둥근 모양) */}
                    <circle cx="12" cy="6" r="3.5" fill="#FFDBAC" />
                    {/* 얼굴 특징 */}
                    <circle cx="10.5" cy="5.5" r="0.8" fill="#000" />
                    <circle cx="13.5" cy="5.5" r="0.8" fill="#000" />
                    <path d="M11 7.5 Q12 8.5 13 7.5" stroke="#000" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                    {/* 머리카락 (피부색과 동일) */}
                    <path d="M8.5 4 Q12 2 15.5 4 Q12 5 8.5 4" fill="#FFDBAC" />
                    {/* 몸통 (초록 드레스, 잎사귀 모양) */}
                    <path d="M9 10 Q12 16 15 10" fill="#228B22" />
                    <path d="M9 10 L8.5 12 L9 14 L10 13.5 L9 10" fill="#2E8B57" />
                    <path d="M15 10 L15.5 12 L15 14 L14 13.5 L15 10" fill="#2E8B57" />
                    {/* 팔 (왼쪽) */}
                    <path d="M8.5 11 L7 13" stroke="#FFDBAC" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="7" cy="13" r="1" fill="#FFDBAC" />
                    {/* 팔 (오른쪽) */}
                    <path d="M15.5 11 L17 13" stroke="#FFDBAC" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="17" cy="13" r="1" fill="#FFDBAC" />
                    {/* 다리 (왼쪽) */}
                    <path d="M11.5 16 L10.5 20" stroke="#FFDBAC" strokeWidth="2" strokeLinecap="round" fill="none" />
                    {/* 다리 (오른쪽) */}
                    <path d="M12.5 16 L13.5 20" stroke="#FFDBAC" strokeWidth="2" strokeLinecap="round" fill="none" />
                    {/* 날개 (왼쪽 - 팔랑이는 효과) */}
                    <g className="fairy-wings">
                      <path d="M5 8 Q7 6 9 8 Q7 10 5 8" fill="#FFB6C1" fillOpacity="0.8" stroke="#FF69B4" strokeWidth="0.5" />
                      <path d="M15 8 Q17 6 19 8 Q17 10 15 8" fill="#FFB6C1" fillOpacity="0.8" stroke="#FF69B4" strokeWidth="0.5" />
                    </g>
                    {/* 반짝임 효과 (별) */}
                    <path d="M8 4 L8.5 5 L9.5 5 L8.5 5.5 L9 6.5 L8 6 L7 6.5 L7.5 5.5 L6.5 5 L7.5 5 Z" fill="#FFD700" opacity="0.9" />
                    <path d="M16 4 L16.5 5 L17.5 5 L16.5 5.5 L17 6.5 L16 6 L15 6.5 L15.5 5.5 L14.5 5 L15.5 5 Z" fill="#FFD700" opacity="0.9" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {data.recipe_recommendations.map((recipe, index) => {
          const hasPairings = (recipe.alcohol_pairings && recipe.alcohol_pairings.length > 0) || (data && data.alcohol_pairings && data.alcohol_pairings.length > 0);
          const pairings = recipe.alcohol_pairings && recipe.alcohol_pairings.length > 0 ? recipe.alcohol_pairings : (data && data.alcohol_pairings ? data.alcohol_pairings.slice(0, 2) : []);
          
          return (
          <div key={index} className="border border-neutral-200 p-5 rounded-sm flex flex-col relative group bg-white hover:shadow-lg transition-all duration-300">
            <button 
                onClick={() => onToggleBookmark(recipe)}
                className="absolute top-4 right-4 text-neutral-300 hover:text-black hover:scale-110 transition-all z-10"
                title={isBookmarked(recipe) ? "북마크 해제" : "북마크 저장"}
            >
                <BookmarkIcon solid={isBookmarked(recipe)} className={`w-5 h-5 ${isBookmarked(recipe) ? 'text-black' : ''}`} />
            </button>

            {/* 제목 및 난이도 섹션 - 고정 높이 */}
            <div className="mb-4" style={{ minHeight: '120px', height: '120px' }}>
              <h3 
                  className="text-xl font-semibold pr-8 cursor-pointer hover:text-blue-600 transition-colors mb-2 break-words line-clamp-2"
                  onClick={() => setSelectedRecipe(recipe)}
                  style={{ minHeight: '56px', height: '56px' }}
              >
                  {recipe.name.replace(/[a-zA-Z]/g, '').trim() || recipe.name}
              </h3>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">{recipe.required_effort}</p>
              <button 
                onClick={() => setSelectedRecipe(recipe)}
                className="w-full bg-neutral-900 text-white py-2.5 px-3 rounded-lg hover:bg-black transition-colors text-sm font-semibold shadow-sm"
              >
                자세히 보기
              </button>
            </div>
            
            {/* 설명 섹션 - 고정 높이 */}
            <div className="mb-4" style={{ minHeight: '80px', maxHeight: '80px' }}>
              <p className="text-neutral-700 text-sm leading-relaxed font-medium break-words line-clamp-3">{recipe.cooking_summary}</p>
            </div>
            
            {/* 재료 섹션 - 고정 높이 */}
            <div className="pt-4 border-t border-neutral-100" style={{ minHeight: '200px' }}>
              <h4 className="font-bold mb-3 text-xs text-neutral-700 uppercase tracking-wide">필요 재료</h4>
              <ul className="space-y-2 text-sm mb-4">
                {(expandedRecipes.has(index) ? recipe.ingredients : recipe.ingredients.slice(0, 4)).map((ing, i) => {
                  const isInCart = shoppingList.includes(ing.item);
                  return (
                    <li key={i} className={`flex items-center justify-between py-1.5 ${ing.is_missing ? (isInCart ? 'text-green-700 bg-green-50 px-2.5 rounded' : 'text-neutral-500') : 'text-neutral-800'}`}>
                      <div className="flex items-start flex-1 min-w-0">
                          {ing.is_missing ? 
                          <ShoppingCartIcon className={`w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5 ${isInCart ? 'text-green-700' : 'text-neutral-400'}`} /> : 
                          <CheckIcon className="w-4 h-4 mr-2.5 text-green-600 flex-shrink-0 mt-0.5" />
                          }
                          <span className="font-medium break-words">{ing.item}</span>
                      </div>
                      <div className="flex items-center gap-2.5 ml-2 flex-shrink-0">
                          <span className="text-sm text-neutral-500 whitespace-nowrap font-medium">{ing.measurement}</span>
                          {ing.is_missing && (
                              <button 
                                  onClick={(e) => handleAddToCart(ing.item, e)}
                                  className={`${isInCart ? 'text-green-700 hover:text-green-800' : 'text-neutral-400 hover:text-blue-600'} transition-colors`}
                                  title="장바구니에 담기"
                              >
                                  <CartPlusIcon className="w-4 h-4" />
                              </button>
                          )}
                      </div>
                    </li>
                  );
                })}
                {recipe.ingredients.length > 4 && (
                    <li className="pt-2">
                        <button
                            onClick={() => toggleRecipeExpansion(index)}
                            className="w-full text-sm font-semibold text-neutral-600 hover:text-neutral-900 py-2 px-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-200"
                        >
                            {expandedRecipes.has(index) ? '접기' : `+ ${recipe.ingredients.length - 4}개 더보기`}
                        </button>
                    </li>
                )}
              </ul>
              
              {/* Alcohol Pairing Section in Card - 고정 높이로 일관성 유지 */}
              <div className="pt-4 border-t border-neutral-100" style={{ minHeight: '140px' }}>
                {hasPairings && pairings.length > 0 ? (
                  <>
                    <h4 className="font-bold mb-3 text-sm text-neutral-700 uppercase tracking-wide">어울리는 술</h4>
                    <div className="space-y-2.5">
                      {pairings.map((pairing, idx) => {
                        const pairingKey = `${index}-${idx}`;
                        const isExpanded = expandedPairings.has(pairingKey);
                        const shouldShowMore = pairing.reason && pairing.reason.length > 80;
                        
                        return (
                          <div key={idx} className="bg-neutral-50 p-3 rounded-lg">
                            <p className="font-bold text-neutral-900 mb-1.5 text-sm break-words">{pairing.name}</p>
                            <p className={`text-neutral-700 leading-relaxed text-sm break-words ${!isExpanded && shouldShowMore ? 'line-clamp-2' : ''}`}>
                              {pairing.reason}
                            </p>
                            {shouldShowMore && (
                              <button
                                onClick={() => togglePairingExpansion(index, idx)}
                                className="mt-1.5 text-xs text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
                              >
                                {isExpanded ? '접기' : '더보기'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>

       {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg shadow-2xl p-8 relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedRecipe(null)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <div className="flex justify-between items-start mb-6 border-b border-neutral-100 pb-4">
                <div>
                    <h3 className="text-3xl font-semibold mb-2">{selectedRecipe.name}</h3>
                    <div className="flex items-center gap-3 text-base text-neutral-600">
                        <span className="bg-neutral-100 px-3 py-1.5 rounded-full text-sm font-bold">{selectedRecipe.required_effort}</span>
                    </div>
                </div>
                <button 
                    onClick={() => onToggleBookmark(selectedRecipe)}
                    className="text-neutral-300 hover:text-black transition-colors mt-2"
                    title={isBookmarked(selectedRecipe) ? "북마크 해제" : "북마크 저장"}
                >
                    <BookmarkIcon solid={isBookmarked(selectedRecipe)} className={`w-8 h-8 ${isBookmarked(selectedRecipe) ? 'text-black' : ''}`} />
                </button>
            </div>

            <p className="text-neutral-800 mb-8 leading-relaxed bg-neutral-50 p-4 rounded-lg italic border-l-4 border-black text-base font-medium">
                {selectedRecipe.cooking_summary}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-bold mb-4 border-b border-neutral-200 pb-2 text-xl">필요한 재료</h4>
                    <ul className="space-y-3 text-base">
                        {selectedRecipe.ingredients.map((ing, i) => {
                            const isInCart = shoppingList.includes(ing.item);
                            return (
                            <li key={i} className={`flex items-center justify-between ${ing.is_missing ? (isInCart ? 'bg-green-50 p-3 rounded-lg' : 'bg-red-50 p-3 rounded-lg') : 'p-2'}`}>
                                <div className="flex items-center flex-1 min-w-0">
                                    {ing.is_missing ? 
                                    <ShoppingCartIcon className={`w-5 h-5 mr-3 flex-shrink-0 ${isInCart ? 'text-green-700' : 'text-red-400'}`} /> : 
                                    <CheckIcon className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                                    }
                                    <span className={`font-semibold ${ing.is_missing ? (isInCart ? 'text-green-700' : 'text-red-700') : 'text-neutral-800'}`}>{ing.item}</span>
                                </div>
                                 <div className="flex items-center gap-2.5 ml-2">
                                    <span className="font-bold text-neutral-700">{ing.measurement}</span>
                                    {ing.is_missing && (
                                        <button 
                                            onClick={(e) => handleAddToCart(ing.item, e)}
                                            className={`${isInCart ? 'text-green-700 hover:text-green-800' : 'text-neutral-400 hover:text-blue-600'} bg-white p-1.5 rounded shadow-sm border border-neutral-200 transition-colors`}
                                            title="장바구니에 담기"
                                        >
                                            <CartPlusIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 border-b border-neutral-200 pb-2 text-xl">만드는 법</h4>
                    {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
                        <ol className="space-y-4 text-base text-neutral-800 list-decimal list-outside pl-5 marker:font-bold marker:text-xl">
                            {selectedRecipe.instructions.map((step, i) => (
                                <li key={i} className="leading-relaxed pl-2 font-medium">
                                    {step}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-neutral-500 italic text-base">상세 조리법이 제공되지 않았습니다.</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeTab;