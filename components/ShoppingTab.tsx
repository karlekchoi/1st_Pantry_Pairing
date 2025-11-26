import React from 'react';
import { ShoppingCartIcon, TrashIcon, XMarkIcon } from './Icons';

interface ShoppingTabProps {
  shoppingList: string[];
  onRemoveItem: (index: number) => void;
}

const ShoppingTab: React.FC<ShoppingTabProps> = ({ shoppingList, onRemoveItem }) => {
  const handleCoupangSearch = (item: string) => {
      const encodedItem = encodeURIComponent(item);
      window.open(`https://www.coupang.com/np/search?rocketAll=false&q=${encodedItem}`, '_blank');
  };

  return (
    <div className="w-full animate-fade-in pb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-light text-neutral-900">장바구니</h2>
        <p className="text-neutral-500 mt-1 text-sm">필요한 재료를 클릭하여 바로 구매하세요.</p>
      </div>

      {shoppingList.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-100 border-dashed">
            <ShoppingCartIcon className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-400 mb-2">장바구니가 비어있습니다.</p>
            <p className="text-sm text-neutral-400">레시피 탭에서 부족한 재료를 담아보세요.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            {shoppingList.map((item, index) => (
                <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors cursor-pointer group"
                    onClick={() => handleCoupangSearch(item)}
                >
                    <div className="flex items-center gap-3">
                         <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
                             <ShoppingCartIcon className="w-5 h-5" />
                         </div>
                         <span className="font-medium text-lg">{item}</span>
                         <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded ml-2 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            사러 가기 &gt;
                         </span>
                    </div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveItem(index);
                        }}
                        className="text-neutral-300 hover:text-red-500 p-2 transition-colors"
                        title="삭제"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingTab;