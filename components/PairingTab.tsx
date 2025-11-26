import React, { useState } from 'react';
import type { AlcoholPairingResponse, Recipe, BookmarkedRecipe, SimplePairingItem } from '../types';
import PairingLoader from './PairingLoader';
import { CheckIcon, ShoppingCartIcon, XMarkIcon, BookmarkIcon, CartPlusIcon } from './Icons';

interface PairingTabProps {
  onGetPairings: (alcohol: string) => void;
  data: AlcoholPairingResponse | null;
  isLoading: boolean;
  bookmarks: BookmarkedRecipe[];
  onToggleBookmark: (recipe: Recipe) => void;
  onAddToCart: (item: string) => void;
  shoppingList: string[];
}

// 추천 단어 목록
const alcoholSuggestions = [
  '맥주', '카스', '테라', '기네스', '하이네켄', '에델바이스', '호가든', '스텔라 아르투아',
  '소주', '참이슬', '진로', '좋은데이', '처음처럼', '이슬톡톡', '한라산', '안동소주',
  '위스키', '조니 워커 블랙', '조니 워커 레드', '잭 다니엘', '짐빔', '크라운 로얄',
  '싱글몰트 위스키', '피트 위스키', '블렌디드 위스키', '맥켈란', '글렌피딕', '글렌드로낙 12년',
  '와인', '카베르네 소비뇽', '메를로', '피노 누아', '샤르도네', '소비뇽 블랑', '리슬링', '샴페인',
  '막걸리', '서울 장수 생막걸리', '동동주', '이천쌀막걸리', '백세주',
  '데킬라', '드라이 진', '보드카', '럼', '브랜디', '코냑',
  '사케', '다이긴조', '준마이', '혼죠조',
  '칵테일', '모히토', '마가리타', '올드 패션드'
];

// 랜덤으로 추천 단어 선택 (화면 로드 시마다 변경)
const getRandomSuggestions = (count: number = 8): string[] => {
  const shuffled = [...alcoholSuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const PairingTab: React.FC<PairingTabProps> = ({ onGetPairings, data, isLoading, bookmarks, onToggleBookmark, onAddToCart, shoppingList }) => {
  const [alcoholInput, setAlcoholInput] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [suggestions] = useState<string[]>(() => getRandomSuggestions(8));

  const handleAddToCart = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  const handleGetPairings = () => {
    if (alcoholInput.trim()) {
      onGetPairings(alcoholInput);
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    if (!data) return;
    const recipe = data.detailed_popup_recipes?.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  const closePopup = () => {
    setSelectedRecipe(null);
  };

  const isBookmarked = (recipe: Recipe) => {
      return bookmarks.some(b => b.name === recipe.name);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in relative pb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-light text-neutral-900">주류 페어링</h2>
        <p className="text-neutral-500 mt-1 text-sm">오늘의 분위기에 맞는 술과 안주를 찾아보세요</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={alcoholInput}
          onChange={(e) => setAlcoholInput(e.target.value)}
          placeholder="예: 레드 와인, 막걸리, 위스키"
          className="w-full flex-grow p-4 bg-neutral-100 text-black placeholder-neutral-500 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleGetPairings()}
        />
        <button
          onClick={handleGetPairings}
          disabled={!alcoholInput.trim() || isLoading}
          className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors flex-shrink-0 font-bold shadow-md"
        >
          추천 받기
        </button>
      </div>

      {/* 추천 단어 버튼들 - 파스텔톤 알록달록 */}
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((suggestion, index) => {
          // 파스텔톤 색상 팔레트 (톤다운된 느낌)
          const pastelColors = [
            { bg: 'bg-pink-100', hover: 'hover:bg-pink-200', text: 'text-pink-700' },
            { bg: 'bg-purple-100', hover: 'hover:bg-purple-200', text: 'text-purple-700' },
            { bg: 'bg-blue-100', hover: 'hover:bg-blue-200', text: 'text-blue-700' },
            { bg: 'bg-cyan-100', hover: 'hover:bg-cyan-200', text: 'text-cyan-700' },
            { bg: 'bg-teal-100', hover: 'hover:bg-teal-200', text: 'text-teal-700' },
            { bg: 'bg-green-100', hover: 'hover:bg-green-200', text: 'text-green-700' },
            { bg: 'bg-yellow-100', hover: 'hover:bg-yellow-200', text: 'text-yellow-700' },
            { bg: 'bg-orange-100', hover: 'hover:bg-orange-200', text: 'text-orange-700' },
            { bg: 'bg-rose-100', hover: 'hover:bg-rose-200', text: 'text-rose-700' },
            { bg: 'bg-indigo-100', hover: 'hover:bg-indigo-200', text: 'text-indigo-700' },
            { bg: 'bg-violet-100', hover: 'hover:bg-violet-200', text: 'text-violet-700' },
            { bg: 'bg-amber-100', hover: 'hover:bg-amber-200', text: 'text-amber-700' },
          ];
          
          const color = pastelColors[index % pastelColors.length];
          
          return (
            <button
              key={index}
              onClick={() => {
                setAlcoholInput(suggestion);
                onGetPairings(suggestion);
              }}
              disabled={isLoading}
              className={`px-4 py-2 ${color.bg} ${color.hover} ${color.text} rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
            >
              {suggestion}
            </button>
          );
        })}
      </div>

      {isLoading && <PairingLoader searchTerm={alcoholInput} />}

      {data && !isLoading && (
        <div className="space-y-8 pt-4 animate-fade-in">
          {/* 선택한 술 표시 */}
          <div className="text-center py-6 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-500 mb-2">오늘 나의 픽은</p>
            <p className="text-2xl font-bold text-neutral-900">"{data.selected_alcohol}"</p>
          </div>

          <div>
            <h3 className="text-xl font-medium border-b border-black pb-2 mb-4">냉장고 버전</h3>
            <ul className="space-y-4">
              {data.recommendations.refrigerator_version.map((item, index) => (
                <li 
                  key={index} 
                  onClick={() => item.is_detailed_available && item.id ? handleRecipeClick(item.id) : null}
                  className={`p-4 border rounded-lg transition-all duration-300 flex justify-between items-start ${item.is_detailed_available ? 'cursor-pointer hover:bg-neutral-50 hover:shadow-md border-neutral-300' : 'border-neutral-100 text-neutral-500'}`}
                >
                  <div className="flex-grow pr-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{item.name}</span>
                        {item.is_detailed_available && (
                            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">레시피 보기</span>
                        )}
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed">{item.reason}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <PairingCategory title="편의점 버전" items={data.recommendations.convenience_store_version} />
          <PairingCategory title="배달 버전" items={data.recommendations.delivery_version} />
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closePopup}>
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-sm shadow-xl p-8 relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={closePopup} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <div className="flex justify-between items-start pr-8 mb-2">
                <h3 className="text-2xl font-medium">{selectedRecipe.name}</h3>
                <button 
                    onClick={() => onToggleBookmark(selectedRecipe)}
                    className="text-neutral-300 hover:text-black transition-colors"
                    title={isBookmarked(selectedRecipe) ? "북마크 해제" : "북마크 저장"}
                >
                    <BookmarkIcon solid={isBookmarked(selectedRecipe)} className={`w-6 h-6 ${isBookmarked(selectedRecipe) ? 'text-black' : ''}`} />
                </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6">
               <span className="bg-neutral-100 px-2 py-0.5 rounded">{selectedRecipe.required_effort}</span>
            </div>

            <p className="text-neutral-700 mb-6 leading-relaxed p-4 bg-neutral-50 border-l-2 border-neutral-300">{selectedRecipe.cooking_summary}</p>

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
                        <p className="text-neutral-500 italic text-base">상세 조리법 정보가 없습니다.</p>
                    )}
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

interface PairingCategoryProps {
  title: string;
  items: SimplePairingItem[];
}

const PairingCategory: React.FC<PairingCategoryProps> = ({ title, items }) => (
  <div>
    <h3 className="text-xl font-medium border-b border-black pb-2 mb-4">{title}</h3>
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="p-4 bg-neutral-50 border border-neutral-100 rounded-lg">
            <div className="font-bold text-lg mb-1">{item.name}</div>
            <p className="text-sm text-neutral-500 leading-relaxed">{item.reason}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default PairingTab;