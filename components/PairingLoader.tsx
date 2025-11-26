import React from 'react';

interface PairingLoaderProps {
  searchTerm?: string;
}

const PairingLoader: React.FC<PairingLoaderProps> = ({ searchTerm = '' }) => {
  // 귀여운 맥주잔 애니메이션
  return (
    <>
      <style>{`
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(-70px) scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes foamBubble {
          0%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.2) translateY(-2px);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .bubble {
          animation: bubbleRise 2s ease-out infinite;
        }
        
        .foam-bubble {
          animation: foamBubble 1.2s ease-in-out infinite;
        }
        
        .mug-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col justify-center items-center p-12 animate-fade-in">
        <div className="relative w-48 h-56 flex items-end justify-center gap-6">
          {/* 왼쪽 귀여운 맥주잔 */}
          <div className="relative w-24 h-36 mug-bounce" style={{ animationDelay: '0s' }}>
            {/* 귀여운 잔 몸체 - 둥글고 부드러운 느낌 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-amber-100/40 via-amber-200/50 to-amber-300/60 rounded-2xl border-3 border-amber-400/60 overflow-hidden shadow-lg" style={{ borderWidth: '3px' }}>
              {/* 맥주 액체 - 밝고 귀여운 황금색 */}
              <div className="absolute bottom-0 w-full h-3/5 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 rounded-b-2xl">
                {/* 액체 내부 거품들 - 더 많고 귀여운 */}
                {[...Array(25)].map((_, i) => {
                  const x = Math.random() * 85 + 7.5;
                  const y = 10 + Math.random() * 35;
                  const size = Math.random() * 5 + 2;
                  const delay = Math.random() * 2;
                  
                  return (
                    <div
                      key={`beer-bubble-${i}`}
                      className="absolute bubble bg-white/70 rounded-full"
                      style={{
                        left: `${x}%`,
                        bottom: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
              </div>
              
              {/* 귀여운 거품 헤드 - 더 두껍고 부드러운 */}
              <div className="absolute top-0 w-full h-2/5 bg-gradient-to-b from-white via-yellow-50/80 to-amber-100/60 rounded-t-2xl overflow-visible">
                {/* 거품 내부 거품들 - 더 크고 귀여운 */}
                {[...Array(15)].map((_, i) => {
                  const x = Math.random() * 80 + 10;
                  const y = Math.random() * 70 + 5;
                  const size = Math.random() * 6 + 4;
                  const delay = Math.random() * 1.5;
                  
                  return (
                    <div
                      key={`foam-bubble-${i}`}
                      className="absolute foam-bubble bg-white/95 rounded-full"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
                
                {/* 귀여운 넘치는 거품 - 더 크고 둥글게 */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/98 rounded-full shadow-sm"></div>
                <div className="absolute -top-2 left-1/5 w-8 h-4 bg-white/95 rounded-full"></div>
                <div className="absolute -top-2 right-1/5 w-7 h-4 bg-white/95 rounded-full"></div>
                <div className="absolute -top-1 left-2/5 w-5 h-3 bg-white/90 rounded-full"></div>
                <div className="absolute -top-1 right-2/5 w-4 h-3 bg-white/90 rounded-full"></div>
              </div>
              
              {/* 귀여운 반짝임 효과 */}
              {[...Array(5)].map((_, i) => {
                const x = Math.random() * 70 + 15;
                const y = 20 + Math.random() * 40;
                const delay = Math.random() * 1.5;
                
                return (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute sparkle bg-yellow-200 rounded-full"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: '4px',
                      height: '4px',
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </div>
            
            {/* 귀여운 잔 손잡이 - 더 크고 둥글게 */}
            <div className="absolute -left-3 top-8 w-6 h-12 border-3 border-amber-400/60 rounded-r-full bg-gradient-to-r from-amber-100/40 to-transparent shadow-md" style={{ borderWidth: '3px' }}>
              {/* 손잡이 장식 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300/50 rounded-full"></div>
            </div>
            
            {/* 귀여운 얼굴 (선택적) */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
              </div>
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-amber-600 rounded-full" style={{ borderWidth: '2px' }}></div>
            </div>
          </div>
          
          {/* 오른쪽 귀여운 맥주잔 */}
          <div className="relative w-24 h-36 mug-bounce" style={{ animationDelay: '0.3s' }}>
            {/* 귀여운 잔 몸체 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-amber-100/40 via-amber-200/50 to-amber-300/60 rounded-2xl border-3 border-amber-400/60 overflow-hidden shadow-lg" style={{ borderWidth: '3px' }}>
              {/* 맥주 액체 */}
              <div className="absolute bottom-0 w-full h-3/5 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 rounded-b-2xl">
                {/* 액체 내부 거품들 */}
                {[...Array(25)].map((_, i) => {
                  const x = Math.random() * 85 + 7.5;
                  const y = 10 + Math.random() * 35;
                  const size = Math.random() * 5 + 2;
                  const delay = Math.random() * 2;
                  
                  return (
                    <div
                      key={`beer-bubble-right-${i}`}
                      className="absolute bubble bg-white/70 rounded-full"
                      style={{
                        left: `${x}%`,
                        bottom: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
              </div>
              
              {/* 귀여운 거품 헤드 */}
              <div className="absolute top-0 w-full h-2/5 bg-gradient-to-b from-white via-yellow-50/80 to-amber-100/60 rounded-t-2xl overflow-visible">
                {/* 거품 내부 거품들 */}
                {[...Array(15)].map((_, i) => {
                  const x = Math.random() * 80 + 10;
                  const y = Math.random() * 70 + 5;
                  const size = Math.random() * 6 + 4;
                  const delay = Math.random() * 1.5;
                  
                  return (
                    <div
                      key={`foam-bubble-right-${i}`}
                      className="absolute foam-bubble bg-white/95 rounded-full"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
                
                {/* 귀여운 넘치는 거품 */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/98 rounded-full shadow-sm"></div>
                <div className="absolute -top-2 left-1/5 w-8 h-4 bg-white/95 rounded-full"></div>
                <div className="absolute -top-2 right-1/5 w-7 h-4 bg-white/95 rounded-full"></div>
                <div className="absolute -top-1 left-2/5 w-5 h-3 bg-white/90 rounded-full"></div>
                <div className="absolute -top-1 right-2/5 w-4 h-3 bg-white/90 rounded-full"></div>
              </div>
              
              {/* 귀여운 반짝임 효과 */}
              {[...Array(5)].map((_, i) => {
                const x = Math.random() * 70 + 15;
                const y = 20 + Math.random() * 40;
                const delay = Math.random() * 1.5;
                
                return (
                  <div
                    key={`sparkle-right-${i}`}
                    className="absolute sparkle bg-yellow-200 rounded-full"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: '4px',
                      height: '4px',
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </div>
            
            {/* 귀여운 잔 손잡이 */}
            <div className="absolute -right-3 top-8 w-6 h-12 border-3 border-amber-400/60 rounded-l-full bg-gradient-to-l from-amber-100/40 to-transparent shadow-md" style={{ borderWidth: '3px' }}>
              {/* 손잡이 장식 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300/50 rounded-full"></div>
            </div>
            
            {/* 귀여운 얼굴 */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
              </div>
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-amber-600 rounded-full" style={{ borderWidth: '2px' }}></div>
            </div>
          </div>
          
          {/* 위로 올라가는 귀여운 거품들 */}
          {[...Array(12)].map((_, i) => {
            const x = 45 + Math.random() * 10;
            const delay = Math.random() * 2.5;
            const size = Math.random() * 5 + 3;
            
            return (
              <div
                key={`bubble-up-${i}`}
                className="absolute bubble bg-white/80 rounded-full shadow-sm"
                style={{
                  left: `${x}%`,
                  bottom: '30%',
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
        <p className="mt-8 text-neutral-500 text-sm font-medium">페어링을 찾고 있어요...</p>
      </div>
    </>
  );
};

export default PairingLoader;
