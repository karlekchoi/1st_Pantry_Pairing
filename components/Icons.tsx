
import React from 'react';

interface IconProps {
  className?: string;
}

export const RefrigeratorIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 6h16M7 7v2m0 8v2" />
  </svg>
);

export const RecipeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18M5.25 6.253L3 5.5v13l2.25.753M18.75 6.253L21 5.5v13l-2.25.753" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9v7.5h-9z" />
  </svg>
);

export const PairingIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c3.314 0 6-2.686 6-6V9.75a.75.75 0 0 0-1.5 0V15.75c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5V9.75a.75.75 0 0 0-1.5 0V15.75c0 3.314 2.686 6 6 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6v6H9z" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export const ShoppingCartIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.103-.816l-1.921-8.814a.5.5 0 0 0-.462-.352H4.425L4.16 3.824A1.125 1.125 0 0 0 3.055 3H2.25Z" />
  </svg>
);

export const CartPlusIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.103-.816l-1.921-8.814a.5.5 0 0 0-.462-.352H4.425L4.16 3.824A1.125 1.125 0 0 0 3.055 3H2.25Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const BookmarkIcon: React.FC<IconProps & { solid?: boolean }> = ({ className = "w-6 h-6", solid = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={solid ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const TagIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);

export const CheckBadgeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

export const DiceIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18C6.67 18 6 17.33 6 16.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.17 6 16 6s1.5.67 1.5 1.5S16.83 9 16 9z"/>
  </svg>
);

// 냉장 - 천장에 달린 프로펠러 아이콘 (명확한 프로펠러 모양)
export const FanIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    {/* 천장 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 2h20M2 2v2M22 2v2" />
    {/* 프로펠러 줄 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v8" />
    {/* 프로펠러 날개 1 (위) */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-4-2M12 12l4-2" />
    {/* 프로펠러 날개 2 (오른쪽) */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l2 4M12 12l-2 4" />
    {/* 프로펠러 날개 3 (왼쪽) */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-2-4M12 12l2-4" />
    {/* 프로펠러 중심 */}
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// 냉동 - 얼음 아이콘 (명확한 얼음 조각 모양)
export const IceIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    {/* 큰 얼음 조각 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l4 4-4 4M8 4l-4 4 4 4" />
    {/* 작은 얼음 조각 1 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 6l2 2-2 2M16 6l-2 2 2 2" />
    {/* 작은 얼음 조각 2 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 14l4 4-4 4M4 14l-4 4 4 4" />
    {/* 작은 얼음 조각 3 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 16l2 2-2 2M18 16l-2 2 2 2" />
    {/* 중앙 얼음 조각 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 10h4v4h-4z" />
  </svg>
);

// 실온 - 바람 아이콘 (명확한 바람 흐름, 연두색)
export const WindIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    {/* 바람 흐름 곡선 1 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 2 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 10c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 3 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 14c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 4 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 5 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 6 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 7 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 8 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 6c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 9 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10c2 0 4-1 5-1s3 1 5 1" />
    {/* 바람 흐름 곡선 10 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 4c1 0 2-1 3-1" />
    {/* 바람 흐름 곡선 11 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 8c1 0 2-1 3-1" />
    {/* 바람 흐름 곡선 12 */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12c1 0 2-1 3-1" />
  </svg>
);
