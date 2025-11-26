
import React, { useState } from 'react';
import type { Tab, RecipeRecommendationResponse, AlcoholPairingResponse, IngredientDetail, IngredientAnalysisResponse, Recipe, BookmarkedRecipe, BookmarkStatus } from './types';
import RefrigeratorTab from './components/RefrigeratorTab';
import RecipeTab from './components/RecipeTab';
import PairingTab from './components/PairingTab';
import BookmarkTab from './components/BookmarkTab';
import ShoppingTab from './components/ShoppingTab';
import Loader from './components/Loader';
import { XMarkIcon, XMarkIcon as CloseIcon } from './components/Icons';
import { getRecipeRecommendations, getAlcoholPairings, analyzeImageIngredients } from './services/geminiService';

// Helper for consistent colorful tags
export const getTagColorClass = (tag: string) => {
  const colors = [
    'bg-red-100 text-red-700 border-red-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-teal-100 text-teal-700 border-teal-200',
    'bg-sky-100 text-sky-700 border-sky-200',
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-violet-100 text-violet-700 border-violet-200',
    'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    'bg-rose-100 text-rose-700 border-rose-200',
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('refrigerator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detailedFridgeIngredients, setDetailedFridgeIngredients] = useState<IngredientDetail[]>([]);
  const [recipeData, setRecipeData] = useState<RecipeRecommendationResponse | null>(null);
  const [pairingData, setPairingData] = useState<AlcoholPairingResponse | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  
  // Bookmark State
  const [bookmarks, setBookmarks] = useState<BookmarkedRecipe[]>([]);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [currentRecipeToBookmark, setCurrentRecipeToBookmark] = useState<Recipe | null>(null);
  
  // Bookmark Modal State
  const [bookmarkStatus, setBookmarkStatus] = useState<BookmarkStatus>('wishlist');
  const [bookmarkTags, setBookmarkTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  const handleAnalyzeImage = async (image: { mimeType: string; data: string }): Promise<IngredientDetail[]> => {
      setIsLoading(true);
      setError(null);
      try {
          const response: IngredientAnalysisResponse = await analyzeImageIngredients(image);
          return response.detected_ingredients;
      } catch (err) {
          setError(err instanceof Error ? err.message : '이미지 분석 중 오류가 발생했습니다.');
          return [];
      } finally {
          setIsLoading(false);
      }
  }

  const handleGetRecipeRecommendations = async (ingredients: IngredientDetail[]) => {
    setActiveTab('recipe'); // Switch tab immediately for better UX
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRecipeRecommendations(ingredients);
      setRecipeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '레시피 추천 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAlcoholPairings = async (alcohol: string) => {
    setIsLoading(true);
    setError(null);
    setPairingData(null);
    try {
      const availableIngredients = detailedFridgeIngredients.map(ing => `${ing.item} (${ing.quantity})`);
      const data = await getAlcoholPairings(alcohol, availableIngredients);
      setPairingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주류 페어링 추천 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Bookmark Logic
  const initiateBookmark = (recipe: Recipe) => {
    const existing = bookmarks.find(b => b.name === recipe.name);
    if (existing) {
        // If already bookmarked, confirm removal
        const confirmRemove = window.confirm("이미 저장된 레시피입니다. 북마크를 해제하시겠습니까?");
        if (confirmRemove) {
            setBookmarks(bookmarks.filter(b => b.name !== recipe.name));
        }
    } else {
        // Open Modal to Add
        setCurrentRecipeToBookmark(recipe);
        setBookmarkStatus('wishlist');
        setBookmarkTags([]);
        setNewTagInput('');
        setIsBookmarkModalOpen(true);
    }
  };

  // Open modal for editing an existing bookmark
  const editBookmark = (recipe: BookmarkedRecipe) => {
      setCurrentRecipeToBookmark(recipe);
      setBookmarkStatus(recipe.status);
      setBookmarkTags(recipe.tags);
      setNewTagInput('');
      setIsBookmarkModalOpen(true);
  };

  const saveBookmark = () => {
      if (!currentRecipeToBookmark) return;

      const newBookmark: BookmarkedRecipe = {
          ...currentRecipeToBookmark,
          status: bookmarkStatus,
          tags: bookmarkTags,
          savedAt: new Date().toLocaleDateString()
      };

      const existingIndex = bookmarks.findIndex(b => b.name === currentRecipeToBookmark.name);
      if (existingIndex >= 0) {
          const updated = [...bookmarks];
          updated[existingIndex] = newBookmark;
          setBookmarks(updated);
      } else {
          setBookmarks([...bookmarks, newBookmark]);
      }
      
      setIsBookmarkModalOpen(false);
      setCurrentRecipeToBookmark(null);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
      if ('key' in e && e.key !== 'Enter') return;
      e.preventDefault();
      
      const tag = newTagInput.trim();
      if (tag && !bookmarkTags.includes(tag)) {
          setBookmarkTags([...bookmarkTags, tag]);
          setNewTagInput('');
      }
  };

  const removeTag = (tagToRemove: string) => {
      setBookmarkTags(bookmarkTags.filter(t => t !== tagToRemove));
  };

  const handleAddToCart = (item: string) => {
      if (!shoppingList.includes(item)) {
          setShoppingList([...shoppingList, item]);
          alert(`${item}이(가) 장바구니에 추가되었습니다.`);
      } else {
          alert("이미 장바구니에 있는 재료입니다.");
      }
  };

  const handleRemoveFromCart = (index: number) => {
      const newList = [...shoppingList];
      newList.splice(index, 1);
      setShoppingList(newList);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'refrigerator':
        return <RefrigeratorTab 
            ingredients={detailedFridgeIngredients} 
            setIngredients={setDetailedFridgeIngredients}
            onAnalyzeImage={handleAnalyzeImage}
            isGlobalLoading={isLoading}
            onGetRecommendations={handleGetRecipeRecommendations}
        />;
      case 'recipe':
        return <RecipeTab 
            data={recipeData} 
            ingredients={detailedFridgeIngredients}
            onGetRecommendations={handleGetRecipeRecommendations}
            bookmarks={bookmarks}
            onToggleBookmark={initiateBookmark}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            shoppingList={shoppingList}
        />;
      case 'bookmark':
        return <BookmarkTab 
            bookmarks={bookmarks} 
            onEditBookmark={editBookmark}
            onAddToCart={handleAddToCart}
            shoppingList={shoppingList}
        />;
      case 'pairing':
        return <PairingTab 
            onGetPairings={handleGetAlcoholPairings} 
            data={pairingData} 
            isLoading={isLoading}
            bookmarks={bookmarks}
            onToggleBookmark={initiateBookmark}
            onAddToCart={handleAddToCart}
            shoppingList={shoppingList}
        />;
      case 'shopping':
        return <ShoppingTab 
            shoppingList={shoppingList} 
            onRemoveItem={handleRemoveFromCart} 
        />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-4 text-sm md:text-base font-medium transition-colors border-b-2 ${
        activeTab === tab 
          ? 'border-black text-black' 
          : 'border-transparent text-neutral-400 hover:text-neutral-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col">
      <header className="text-center pt-12 pb-8 px-4 bg-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-3 text-black" style={{ fontFamily: "serif" }}>Pantry Pairing</h1>
        <p className="text-neutral-500 text-base md:text-lg font-light" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>냉장고 속 재료로 행복을 완성하다</p>
      </header>

      <nav className="sticky top-0 z-10 flex justify-center border-b border-neutral-200 bg-white px-4 mb-8 overflow-x-auto">
        <div className="flex w-full max-w-3xl min-w-max">
          <TabButton tab="refrigerator" label="나의 팬트리" />
          <TabButton tab="recipe" label="레시피" />
          <TabButton tab="bookmark" label="북마크" />
          <TabButton tab="pairing" label="페어링" />
          <TabButton tab="shopping" label="장바구니" />
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 pb-8 max-w-4xl relative">
        {error && <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg mb-6 text-sm">{error}</div>}
        {renderTabContent()}
      </main>

       <footer className="text-center p-8 text-xs text-neutral-300 mt-auto">
          <p>&copy; {new Date().getFullYear()} Pantry Pairing.</p>
       </footer>

       {/* Global Bookmark Modal */}
       {isBookmarkModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsBookmarkModalOpen(false)}>
               <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
                   <button 
                        onClick={() => setIsBookmarkModalOpen(false)} 
                        className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    
                    <h3 className="text-xl font-bold mb-1">레시피 저장</h3>
                    <p className="text-neutral-500 text-sm mb-6">{currentRecipeToBookmark?.name}</p>

                    <div className="space-y-6">
                        {/* Status Selection */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">저장 위치</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setBookmarkStatus('wishlist')}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${bookmarkStatus === 'wishlist' ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}`}
                                >
                                    만들고 싶은 요리
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setBookmarkStatus('completed')}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${bookmarkStatus === 'completed' ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}`}
                                >
                                    완성한 요리
                                </button>
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">해시태그</label>
                            <div className="flex items-center gap-2 mb-3">
                                <input 
                                    type="text" 
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="#태그 입력 (Enter)"
                                    className="flex-grow p-2 bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-black text-sm"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddTag}
                                    className="bg-neutral-900 text-white px-3 py-2 rounded text-sm hover:bg-black"
                                >
                                    추가
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[2rem]">
                                {bookmarkTags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className={`px-2 py-1 rounded text-xs flex items-center gap-1 border ${getTagColorClass(tag)}`}
                                    >
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-black hover:scale-110"><CloseIcon className="w-3 h-3"/></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={saveBookmark}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                        >
                            저장하기
                        </button>
                    </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default App;
