import React, { useState } from 'react';
import type { BookmarkedRecipe, BookmarkStatus } from '../types';
import { CheckIcon, ShoppingCartIcon, BookmarkIcon, XMarkIcon, CartPlusIcon, TagIcon, PencilIcon, CheckBadgeIcon } from './Icons';
import { getTagColorClass } from '../App';

interface BookmarkTabProps {
  bookmarks: BookmarkedRecipe[];
  onEditBookmark: (recipe: BookmarkedRecipe) => void;
  onAddToCart: (item: string) => void;
  shoppingList: string[];
}

const BookmarkTab: React.FC<BookmarkTabProps> = ({ bookmarks, onEditBookmark, onAddToCart, shoppingList }) => {
  const [activeSubTab, setActiveSubTab] = useState<BookmarkStatus>('wishlist');
  const [selectedRecipe, setSelectedRecipe] = useState<BookmarkedRecipe | null>(null);
  
  // Hashtag Filtering
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const handleAddToCart = (item: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(item);
  };

  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags))) as string[];

  const filteredBookmarks = bookmarks.filter(b => {
      const matchesStatus = b.status === activeSubTab;
      const matchesTag = selectedTag ? b.tags.includes(selectedTag) : true;
      return matchesStatus && matchesTag;
  });

  return (
    <div className="w-full animate-fade-in pb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-light text-neutral-900">북마크</h2>
        <p className="text-neutral-500 mt-1 text-sm">나만의 레시피 컬렉션</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
          <button 
            onClick={() => { setActiveSubTab('wishlist'); setSelectedTag(null); }}
            className={`flex-1 py-3 text-center font-medium text-sm transition-colors relative ${activeSubTab === 'wishlist' ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
              만들고 싶은 요리
              {activeSubTab === 'wishlist' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
          </button>
          <button 
            onClick={() => { setActiveSubTab('completed'); setSelectedTag(null); }}
            className={`flex-1 py-3 text-center font-medium text-sm transition-colors relative ${activeSubTab === 'completed' ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
              완성한 요리
               {activeSubTab === 'completed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
          </button>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex gap-2 items-center overflow-x-auto hide-scrollbar">
              {selectedTag && (
                  <button 
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap border ${getTagColorClass(selectedTag)}`}
                  >
                      #{selectedTag} <XMarkIcon className="w-3 h-3" />
                  </button>
              )}
              <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {filteredBookmarks.length}개의 레시피
              </span>
          </div>
          <button 
            onClick={() => setIsTagModalOpen(true)}
            className="text-xs font-bold text-neutral-500 hover:text-black flex items-center gap-1 py-1 px-2 rounded hover:bg-neutral-100 transition-colors"
          >
              <TagIcon className="w-4 h-4" /> 해시태그 모아보기
          </button>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-20 text-neutral-400 bg-neutral-50 rounded-lg border border-neutral-100 border-dashed">
          <BookmarkIcon className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
          <p className="text-sm">
              {activeSubTab === 'wishlist' ? '만들고 싶은 요리가 없습니다.' : '아직 완성한 요리가 없습니다.'}
          </p>
          {selectedTag && <p className="text-xs mt-2">선택한 해시태그에 해당하는 결과가 없습니다.</p>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
            {filteredBookmarks.map((recipe, index) => (
            <div key={index} className="border border-neutral-200 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col relative group">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium pr-8 cursor-pointer hover:text-blue-600" onClick={() => setSelectedRecipe(recipe)}>
                        {recipe.name}
                    </h3>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => onEditBookmark(recipe)}
                            className="text-neutral-300 hover:text-black p-1 rounded transition-colors"
                            title="수정 / 이동"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.map(tag => (
                        <button 
                            key={tag} 
                            onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                            className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${getTagColorClass(tag)}`}
                        >
                            #{tag}
                        </button>
                    ))}
                    {recipe.tags.length === 0 && <span className="text-[10px] text-neutral-300">태그 없음</span>}
                </div>

                <p className="text-neutral-600 text-sm mb-4 flex-grow leading-relaxed">{recipe.cooking_summary}</p>
                
                <div className="flex justify-between items-center pt-3 border-t border-neutral-100 mt-auto">
                     <span className="text-xs text-neutral-400">{recipe.savedAt} 저장됨</span>
                     <button 
                        onClick={() => setSelectedRecipe(recipe)}
                        className="text-xs font-bold bg-neutral-900 text-white px-3 py-1.5 rounded hover:bg-black transition-colors"
                     >
                        레시피 보기
                     </button>
                </div>
                
                {recipe.status === 'completed' && (
                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm z-10" title="완성함">
                        <CheckBadgeIcon className="w-5 h-5" />
                    </div>
                )}
            </div>
            ))}
        </div>
      )}

      {/* Hashtag Modal */}
      {isTagModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsTagModalOpen(false)}>
               <div className="bg-white w-full max-w-sm rounded-lg shadow-xl p-6 relative" onClick={e => e.stopPropagation()}>
                   <button onClick={() => setIsTagModalOpen(false)} className="absolute top-4 right-4"><XMarkIcon className="w-5 h-5 text-neutral-400"/></button>
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                       <TagIcon className="w-5 h-5"/> 해시태그 목록
                   </h3>
                   {allTags.length === 0 ? (
                       <p className="text-neutral-400 text-sm py-4 text-center">등록된 해시태그가 없습니다.</p>
                   ) : (
                       <div className="flex flex-wrap gap-2">
                           {allTags.map(tag => (
                               <button 
                                key={tag}
                                onClick={() => { setSelectedTag(tag); setIsTagModalOpen(false); }}
                                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedTag === tag ? 'bg-black text-white border-black' : getTagColorClass(tag)}`}
                               >
                                   #{tag}
                               </button>
                           ))}
                       </div>
                   )}
                   <button onClick={() => { setSelectedTag(null); setIsTagModalOpen(false); }} className="w-full mt-6 border border-neutral-200 py-2 rounded text-sm font-medium hover:bg-neutral-50">
                       필터 초기화
                   </button>
               </div>
           </div>
      )}

      {/* Recipe Detail Modal (Reused) */}
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
                    <h3 className="text-3xl font-light mb-2">{selectedRecipe.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <span className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-bold">{selectedRecipe.required_effort}</span>
                         {selectedRecipe.tags.map(tag => (
                             <span key={tag} className={`text-xs px-1.5 py-0.5 rounded border ${getTagColorClass(tag)}`}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-neutral-700 mb-8 leading-relaxed bg-neutral-50 p-4 rounded-lg italic border-l-4 border-black">
                {selectedRecipe.cooking_summary}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-bold mb-4 border-b border-neutral-200 pb-2 text-lg">필요한 재료</h4>
                    <ul className="space-y-3 text-sm">
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
                                            <CartPlusIcon className={`w-5 h-5 ${isInCart ? 'text-green-700' : ''}`} />
                                        </button>
                                    )}
                                </div>
                            </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 border-b border-neutral-200 pb-2 text-lg">만드는 법</h4>
                    {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
                        <ol className="space-y-4 text-sm text-neutral-800 list-decimal list-outside pl-4 marker:font-bold marker:text-lg">
                            {selectedRecipe.instructions.map((step, i) => (
                                <li key={i} className="leading-relaxed pl-2">
                                    {step}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-neutral-500 italic">상세 조리법이 제공되지 않았습니다.</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkTab;