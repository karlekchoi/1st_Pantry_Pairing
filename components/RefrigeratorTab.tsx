import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, TrashIcon, SparklesIcon, XMarkIcon, PencilIcon, CalendarIcon } from './Icons';
import type { IngredientDetail, StorageLocation } from '../types';

interface RefrigeratorTabProps {
  ingredients: IngredientDetail[];
  setIngredients: (ingredients: IngredientDetail[]) => void;
  onAnalyzeImage: (image: { mimeType: string, data: string }) => Promise<IngredientDetail[]>;
  isGlobalLoading: boolean;
  onGetRecommendations: (ingredients: IngredientDetail[]) => void;
}

const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeType, data] = result.split(';base64,');
      resolve({ mimeType: mimeType.replace('data:', ''), data });
    };
    reader.onerror = (error) => reject(error);
  });
};

const RefrigeratorTab: React.FC<RefrigeratorTabProps> = ({ ingredients, setIngredients, onAnalyzeImage, isGlobalLoading, onGetRecommendations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ item: '', quantity: '', storage: '냉장' as StorageLocation, expiration_date: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State for ingredients found in image but not yet added to main list
  const [analyzedIngredients, setAnalyzedIngredients] = useState<IngredientDetail[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Expiry Warning State
  const [expiringIngredients, setExpiringIngredients] = useState<IngredientDetail[]>([]);
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const hasCheckedExpiry = useRef(false);
  
  // Storage Tab State
  const [activeStorageTab, setActiveStorageTab] = useState<StorageLocation>('냉장');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null); // Ref for auto-focusing name input
  const dateInputRef = useRef<HTMLInputElement>(null); // Hidden date input ref
  
  const storageCategories: StorageLocation[] = ['냉장', '냉동', '실온'];

  // Check for expiration on mount or when ingredients change
  useEffect(() => {
      if (ingredients.length > 0 && !hasCheckedExpiry.current) {
          const today = new Date();
          const expiring = ingredients.filter(ing => {
              if (!ing.expiration_date || ing.expiration_date === 'N/A') return false;
              const expDate = new Date(ing.expiration_date);
              const diffTime = expDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 3;
          });

          if (expiring.length > 0) {
              setExpiringIngredients(expiring);
              setIsExpiryModalOpen(true);
              hasCheckedExpiry.current = true;
          }
      }
  }, [ingredients]);

  const handleQuickRecipeSearch = () => {
      setIsExpiryModalOpen(false);
      onGetRecommendations(expiringIngredients);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(null);
  };

  // Enhanced Date Input Handler
  const handleDateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 허용, 최대 8자리
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    setNewItem({ ...newItem, expiration_date: numericValue });
  };

  const handleDateBlur = () => {
    setIsDateFocused(false);
    const val = newItem.expiration_date.replace(/[^0-9]/g, '');
    
    // Case: YYMMDD (6 digits) -> 20YY-MM-DD
    if (val.length === 6) {
        const yy = val.substring(0, 2);
        const mm = val.substring(2, 4);
        const dd = val.substring(4, 6);
        // 유효성 검사
        const month = parseInt(mm);
        const day = parseInt(dd);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          setNewItem({ ...newItem, expiration_date: `20${yy}-${mm}-${dd}` });
        } else {
          // 유효하지 않으면 초기화
          setNewItem({ ...newItem, expiration_date: '' });
        }
    }
    // Case: YYYYMMDD (8 digits) -> YYYY-MM-DD
    else if (val.length === 8) {
        const yyyy = val.substring(0, 4);
        const mm = val.substring(4, 6);
        const dd = val.substring(6, 8);
        // 유효성 검사
        const month = parseInt(mm);
        const day = parseInt(dd);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          setNewItem({ ...newItem, expiration_date: `${yyyy}-${mm}-${dd}` });
        } else {
          setNewItem({ ...newItem, expiration_date: '' });
        }
    }
    // 빈 값이면 그대로 유지
    else if (val.length === 0) {
      setNewItem({ ...newItem, expiration_date: '' });
    }
  };

  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsDateFocused(true);
    // 포커스 시 입력 필드 비우기 (커서만 보이게)
    setNewItem({ ...newItem, expiration_date: '' });
  };

  const handleHiddenDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setNewItem({ ...newItem, expiration_date: dateValue });
  };

  const triggerDatePicker = () => {
    setIsCalendarOpen(true);
    // 팝업이 열릴 때 date input의 value를 현재 날짜로 설정
    setTimeout(() => {
      if (dateInputRef.current) {
        const currentValue = newItem.expiration_date && newItem.expiration_date !== 'N/A' && newItem.expiration_date.includes('-') 
          ? newItem.expiration_date 
          : getTodayDate();
        dateInputRef.current.value = currentValue;
      }
    }, 0);
  };

  const handleCalendarDateSelect = (date: string) => {
    setNewItem({ ...newItem, expiration_date: date });
    setIsCalendarOpen(false);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  const openAddModal = () => {
    setNewItem({ item: '', quantity: '', storage: activeStorageTab, expiration_date: '' });
    setEditingIndex(null);
    handleClearImage();
    setIsModalOpen(true);
    // Autofocus happens via autoFocus attribute, but for safety:
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const openEditModal = (index: number, ingredient: IngredientDetail) => {
      setNewItem(ingredient);
      setEditingIndex(index);
      handleClearImage();
      setIsModalOpen(true);
      setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const validateForm = () => {
      if (!newItem.item.trim()) {
          setErrorMsg("재료명을 입력해주세요.");
          return false;
      }
      return true;
  };
  
  const handleAddOrUpdateIngredient = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      if (editingIndex !== null) {
          const updated = [...ingredients];
          updated[editingIndex] = newItem;
          setIngredients(updated);
      } else {
          setIngredients([...ingredients, newItem]);
      }
      
      handleCloseModal();
  };

  const handleAddAndContinue = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      // Add item using direct prop access to avoid closure staleness
      const updatedIngredients = [...ingredients, newItem];
      setIngredients(updatedIngredients);
      
      // Reset form but keep storage selection for convenience
      setNewItem(prev => ({ 
          item: '', 
          quantity: '', 
          storage: prev.storage, 
          expiration_date: '' 
      }));
      
      setErrorMsg(null);
      // Refocus input for next entry
      nameInputRef.current?.focus();
  };

  const handleCloseModal = () => {
      setNewItem({ item: '', quantity: '', storage: activeStorageTab, expiration_date: '' });
      setEditingIndex(null);
      handleClearImage();
      setIsModalOpen(false);
  };
  
  const handleDeleteIngredient = (index: number) => {
      if (window.confirm("이 재료를 삭제하시겠습니까?")) {
        setIngredients(ingredients.filter((_, i) => i !== index));
      }
  }

  const handleClearCategory = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent bubbling issues
      if (window.confirm(`${activeStorageTab} 보관 재료를 모두 삭제하시겠습니까?`)) {
          // Keep ingredients that are NOT in the current active tab
          const remainingIngredients = ingredients.filter(ing => ing.storage !== activeStorageTab);
          setIngredients(remainingIngredients);
      }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setAnalyzedIngredients([]); 
      setEditingIndex(null);
      setIsModalOpen(true); 
    }
  };

  const handleAnalyzeClick = async () => {
      if (!imageFile) return;
      setIsAnalyzing(true);
      try {
          const { mimeType, data } = await fileToBase64(imageFile);
          const results = await onAnalyzeImage({ mimeType, data });
          setAnalyzedIngredients(results);
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleConfirmAnalysis = () => {
      setIngredients([...ingredients, ...analyzedIngredients]);
      setAnalyzedIngredients([]);
      handleClearImage();
      setIsModalOpen(false);
  };
  
  const handleClearImage = () => {
      setImageFile(null);
      setImagePreview(null);
      setAnalyzedIngredients([]);
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const getDaysRemaining = (dateStr: string) => {
      if (!dateStr || dateStr === 'N/A') return null;
      const today = new Date();
      today.setHours(0,0,0,0);
      const target = new Date(dateStr);
      target.setHours(0,0,0,0);
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
  };

  const isLoading = isGlobalLoading || isAnalyzing;
  const currentIngredientsCount = ingredients.filter(ing => ing.storage === activeStorageTab).length;

  return (
    <div className="w-full animate-fade-in pb-24">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-light text-neutral-900">나의 팬트리</h2>
            <p className="text-sm text-neutral-500 mt-1">신선한 재료 관리의 시작</p>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" disabled={isLoading}/>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
                title="사진으로 추가"
            >
                <CameraIcon className="w-6 h-6" />
            </button>
            <button 
                onClick={openAddModal}
                className="p-2 bg-black text-white rounded-full hover:bg-neutral-800 transition-all shadow-md"
                title="재료 추가"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
      </div>

      {/* Storage Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
          {storageCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveStorageTab(cat)}
                className={`flex-1 py-3 text-center font-medium text-sm transition-colors relative ${activeStorageTab === cat ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                  {cat}
                  {activeStorageTab === cat && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
              </button>
          ))}
      </div>

      {/* Ingredient List */}
      <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activeStorageTab === '냉장' ? 'bg-blue-400' : activeStorageTab === '냉동' ? 'bg-indigo-500' : 'bg-orange-400'}`}></div>
                  <span className="text-sm text-neutral-500">{currentIngredientsCount}개의 재료</span>
              </div>
              {currentIngredientsCount > 0 && (
                  <button 
                      type="button"
                      onClick={handleClearCategory} 
                      className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50"
                  >
                      <TrashIcon className="w-4 h-4" />
                      <span>전체 삭제</span>
                  </button>
              )}
          </div>

          {currentIngredientsCount === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-100 border-dashed">
                  <p className="text-neutral-400 mb-4">{activeStorageTab}에 보관 중인 재료가 없습니다.</p>
                  <button onClick={openAddModal} className="text-sm font-bold underline">
                      재료 추가하기
                  </button>
              </div>
          ) : (
              <div className="grid gap-3">
                  {ingredients.map((ing, index) => {
                      // Only render ingredients matching the current tab
                      if (ing.storage !== activeStorageTab) return null;

                      const daysRemaining = getDaysRemaining(ing.expiration_date);
                      const isExpiring = daysRemaining !== null && daysRemaining <= 3;
                      
                      return (
                          <div key={index} className={`p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group ${isExpiring ? 'border-red-200 ring-1 ring-red-50' : 'border-neutral-100'}`}>
                              <div className="flex-1">
                                  <div className="flex items-baseline gap-2">
                                      <span className="font-bold text-neutral-900 text-lg">{ing.item}</span>
                                      <span className="text-sm text-neutral-500">{ing.quantity}</span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1">
                                      <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${isExpiring ? 'bg-red-100 text-red-600 font-bold' : 'text-neutral-400 bg-neutral-50'}`}>
                                          <CalendarIcon className="w-3 h-3" />
                                          {ing.expiration_date || '유통기한 미입력'}
                                          {daysRemaining !== null && (
                                              <span>
                                                  {daysRemaining < 0 ? `(${Math.abs(daysRemaining)}일 지남)` : (daysRemaining === 0 ? '(오늘)' : `(D-${daysRemaining})`)}
                                              </span>
                                          )}
                                      </span>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                      onClick={() => openEditModal(index, ing)}
                                      className="text-neutral-300 hover:text-blue-500 p-2 transition-colors"
                                      title="수정"
                                  >
                                      <PencilIcon className="w-5 h-5" />
                                  </button>
                                  <button 
                                      onClick={() => handleDeleteIngredient(index)} 
                                      className="text-neutral-300 hover:text-red-500 p-2 transition-colors"
                                      title="삭제"
                                  >
                                      <TrashIcon className="w-5 h-5" />
                                  </button>
                              </div>
                          </div>
                      )
                  })}
              </div>
          )}
      </div>

      {/* Expiry Warning Modal */}
      {isExpiryModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsExpiryModalOpen(false)}>
               <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 relative border-t-4 border-red-500" onClick={e => e.stopPropagation()}>
                   <button onClick={() => setIsExpiryModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-black">
                       <XMarkIcon className="w-6 h-6" />
                   </button>
                   
                   <div className="text-center mb-6">
                       <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                           <SparklesIcon className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-bold">유통기한 임박 재료 알림</h3>
                       <p className="text-neutral-500 text-sm mt-1">빨리 소진해야 할 재료들이 있어요!</p>
                   </div>
                   
                   <div className="bg-neutral-50 rounded-lg p-3 mb-6 max-h-40 overflow-y-auto">
                       {expiringIngredients.map((ing, i) => (
                           <div key={i} className="flex justify-between py-2 border-b border-neutral-100 last:border-0">
                               <span className="font-medium text-neutral-800">{ing.item}</span>
                               <span className="text-xs text-red-500 font-bold self-center">
                                   {ing.expiration_date}
                               </span>
                           </div>
                       ))}
                   </div>
                   
                   <button 
                       onClick={handleQuickRecipeSearch}
                       className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-neutral-800 shadow-lg transition-all flex items-center justify-center gap-2"
                   >
                       <SparklesIcon className="w-5 h-5 text-yellow-300" />
                       <span>이 재료들로 레시피 추천받기</span>
                   </button>
               </div>
           </div>
      )}

      {/* Calendar Popup Overlay - Close when clicking outside */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleCalendarClose}
          style={{ backgroundColor: 'transparent' }}
        ></div>
      )}

      {/* Add/Edit Ingredient / Image Analysis Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => !isLoading && handleCloseModal()}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
              disabled={isLoading}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold mb-6">
                {imagePreview ? '이미지 분석' : (editingIndex !== null ? '재료 수정하기' : '재료 추가하기')}
            </h3>
            
            {imagePreview ? (
                // Image Analysis UI inside Modal
                 <div className="space-y-4">
                    <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg"/>
                    </div>
                    
                    {analyzedIngredients.length === 0 ? (
                        <button 
                            onClick={handleAnalyzeClick} 
                            disabled={isLoading} 
                            className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-black disabled:bg-neutral-400 flex items-center justify-center gap-2 transition-all"
                        >
                            {isAnalyzing ? (
                                <span>분석 중...</span>
                            ) : (
                                <><SparklesIcon className="w-5 h-5"/><span>이 사진 분석하기</span></>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-4">
                             <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                                 <h4 className="font-bold text-sm">분석된 재료 확인</h4>
                             </div>
                             <ul className="max-h-48 overflow-y-auto space-y-2">
                                {analyzedIngredients.map((ing, i) => (
                                    <li key={i} className="p-2 bg-neutral-50 border border-neutral-200 rounded text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-bold">{ing.item}</span>
                                            <span className="text-neutral-500">{ing.quantity}</span>
                                        </div>
                                    </li>
                                ))}
                             </ul>
                             <button 
                                onClick={handleConfirmAnalysis}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold"
                             >
                                모두 추가하기
                             </button>
                        </div>
                    )}
                 </div>
            ) : (
                // Manual Entry Form
                <form onSubmit={handleAddOrUpdateIngredient} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-800">재료명 <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="item"
                            ref={nameInputRef} 
                            value={newItem.item} 
                            onChange={handleInputChange} 
                            placeholder="예: 계란" 
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900" 
                            autoFocus
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-800">수량</label>
                        <input 
                            type="text" 
                            name="quantity" 
                            value={newItem.quantity} 
                            onChange={handleInputChange} 
                            placeholder="예: 2개, 300g" 
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-800">보관 방식</label>
                        <div className="flex gap-2">
                            {storageCategories.map(cat => (
                                <label key={cat} className={`flex-1 cursor-pointer py-3 px-2 text-center rounded-lg border transition-all ${newItem.storage === cat ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'}`}>
                                    <input 
                                        type="radio" 
                                        name="storage" 
                                        value={cat} 
                                        checked={newItem.storage === cat} 
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-neutral-800">유통기한</label>
                        <div className="relative flex items-center gap-2">
                            {/* Text input for typing yymmdd */}
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    name="expiration_date"
                                    value={isDateFocused ? (newItem.expiration_date || '') : (newItem.expiration_date && newItem.expiration_date !== 'N/A' && newItem.expiration_date.includes('-') ? newItem.expiration_date : '')}
                                    onChange={handleDateTextChange}
                                    onFocus={handleDateFocus}
                                    onBlur={handleDateBlur}
                                    placeholder=""
                                    maxLength={8}
                                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-800"
                                />
                                {/* Display placeholder when not focused and empty */}
                                {!isDateFocused && (!newItem.expiration_date || newItem.expiration_date === 'N/A' || newItem.expiration_date === '') && (
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-neutral-300 text-sm">
                                        {getTodayDate()}
                                    </div>
                                )}
                            </div>
                            
                            {/* Calendar Icon Button to trigger picker */}
                            <div className="relative">
                                <input 
                                    type="date" 
                                    name="expiration_date_hidden"
                                    ref={dateInputRef}
                                    value={newItem.expiration_date && newItem.expiration_date !== 'N/A' && newItem.expiration_date.includes('-') ? newItem.expiration_date : ''}
                                    onChange={handleHiddenDateChange}
                                    className="hidden"
                                />
                                <button 
                                    type="button"
                                    onClick={triggerDatePicker}
                                    className="text-neutral-400 hover:text-black p-2 transition-colors relative z-10"
                                >
                                    <CalendarIcon className="w-5 h-5" />
                                </button>
                                
                                {/* Custom Calendar Popup - positioned next to icon */}
                                {isCalendarOpen && (
                                    <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-neutral-200 rounded-lg shadow-xl p-4" style={{ minWidth: '280px' }} onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="date" 
                                            ref={dateInputRef}
                                            value={newItem.expiration_date && newItem.expiration_date !== 'N/A' && newItem.expiration_date.includes('-') ? newItem.expiration_date : getTodayDate()}
                                            defaultValue={getTodayDate()}
                                            onChange={(e) => {
                                                handleCalendarDateSelect(e.target.value);
                                            }}
                                            className="w-full p-2 border border-neutral-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 클릭 시 네이티브 달력 열기 (현재 날짜 기준)
                                                if (dateInputRef.current) {
                                                    // value가 없으면 오늘 날짜로 설정
                                                    if (!dateInputRef.current.value) {
                                                        dateInputRef.current.value = getTodayDate();
                                                    }
                                                    dateInputRef.current.showPicker();
                                                }
                                            }}
                                            onFocus={(e) => {
                                                e.stopPropagation();
                                                // 포커스 시에도 오늘 날짜로 설정
                                                if (!e.target.value) {
                                                    e.target.value = getTodayDate();
                                                }
                                                e.target.showPicker();
                                            }}
                                        />
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNewItem({ ...newItem, expiration_date: '' });
                                                    setIsCalendarOpen(false);
                                                }}
                                                className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded hover:bg-neutral-50 transition-colors"
                                            >
                                                삭제
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCalendarDateSelect(getTodayDate());
                                                }}
                                                className="flex-1 px-3 py-2 text-sm bg-neutral-900 text-white rounded hover:bg-black transition-colors"
                                            >
                                                오늘
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">yymmdd 형식으로 입력하거나 달력을 클릭하세요</p>
                    </div>
                    
                    {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}

                    <div className="flex gap-3 mt-4">
                        {editingIndex === null && (
                            <button 
                                type="button" 
                                onClick={handleAddAndContinue}
                                className="flex-1 bg-white text-neutral-900 border border-neutral-200 font-bold py-4 rounded-lg hover:bg-neutral-50 transition-all shadow-sm"
                            >
                                + 계속 추가
                            </button>
                        )}
                        <button type="submit" className="flex-1 bg-neutral-900 text-white font-bold py-4 rounded-lg hover:bg-black transition-all shadow-sm">
                            {editingIndex !== null ? '수정하기' : '완료'}
                        </button>
                    </div>
                </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefrigeratorTab;