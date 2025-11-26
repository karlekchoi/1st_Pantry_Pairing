import React from 'react';

const RecipeLoader: React.FC = () => {
  // 작은 별들의 위치 (지팡이 주변에 귀여운 배치)
  const starPositions = [
    { angle: 0, radius: 40, size: 6, orbitSpeed: 8 },
    { angle: 45, radius: 35, size: 5, orbitSpeed: 9 },
    { angle: 90, radius: 42, size: 7, orbitSpeed: 7 },
    { angle: 135, radius: 38, size: 6, orbitSpeed: 10 },
    { angle: 180, radius: 40, size: 5, orbitSpeed: 8.5 },
    { angle: 225, radius: 36, size: 7, orbitSpeed: 9.5 },
    { angle: 270, radius: 41, size: 6, orbitSpeed: 7.5 },
    { angle: 315, radius: 39, size: 5, orbitSpeed: 10.5 },
  ];

  return (
    <>
      <style>{`
        @keyframes starTwinkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
      <div className="flex flex-col justify-center items-center p-12 animate-fade-in">
        <div className="relative w-24 h-24">
          {/* 귀여운 마법 지팡이 */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center">
            <div className="relative">
              {/* 지팡이 막대 - 더 작고 귀여운 스타일 */}
              <div className="w-0.5 h-16 bg-gradient-to-b from-purple-600 via-pink-500 to-purple-400 rounded-full shadow-md"></div>
              {/* 지팡이 끝부분 - 별 모양 */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-yellow-300">
                  <path
                    d="M12 2L14.5 7.5L20.5 8.5L16.5 12.5L17.5 18.5L12 15.5L6.5 18.5L7.5 12.5L3.5 8.5L9.5 7.5L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 작은 별들이 반짝반짝하며 지팡이 주변을 맴돌기 */}
          {starPositions.map((star, i) => {
            const delay = i * 0.1;
            const orbitKeyframes = `@keyframes starOrbit${i} {
              0% {
                transform: translate(-50%, -50%) rotate(${star.angle}deg) translateX(${star.radius}px) rotate(-${star.angle}deg);
              }
              100% {
                transform: translate(-50%, -50%) rotate(${star.angle + 360}deg) translateX(${star.radius}px) rotate(-${star.angle + 360}deg);
              }
            }`;
            
            return (
              <React.Fragment key={i}>
                <style>{orbitKeyframes}</style>
                <div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    animation: `starTwinkle 1.2s ease-in-out infinite, starOrbit${i} ${star.orbitSpeed}s linear infinite`,
                    animationDelay: `${delay}s, 0s`,
                  }}
                >
                  {/* 작은 별 모양 */}
                  <svg
                    width={star.size}
                    height={star.size}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-yellow-400"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        <p className="mt-8 text-neutral-500 text-sm font-medium">레시피를 생성하고 있어요...</p>
      </div>
    </>
  );
};

export default RecipeLoader;
