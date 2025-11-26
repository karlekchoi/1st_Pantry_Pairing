// 폰트 자동 로드 유틸리티

// 알려진 폰트 파일 목록 (public/fonts 폴더에서 자동 감지)
const FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];

export const loadCustomFonts = async (): Promise<void> => {
  try {
    const fontPath = '/fonts/NanumSquareRoundR.ttf';
    const fontName = 'NanumSquareRound';
    
    console.log(`🔄 폰트 로드 시작: ${fontPath}`);
    
    // FontFace API를 사용하여 폰트 로드
    const fontFace = new FontFace(
      fontName,
      `url(${fontPath}) format('truetype')`
    );

    // 폰트 로드
    const loadedFont = await fontFace.load();
    
    // 문서에 폰트 추가
    document.fonts.add(loadedFont);
    
    // 폰트가 로드되었는지 확인
    await document.fonts.ready;
    
    // body에 폰트 적용
    document.body.style.fontFamily = `"${fontName}", 'Noto Sans KR', sans-serif`;
    
    // 모든 요소에 폰트 상속 적용 (제목과 특정 요소 제외)
    const style = document.createElement('style');
    style.textContent = `
      * {
        font-family: "${fontName}", 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
      /* 제목과 특정 텍스트는 원래 폰트 사용 */
      header h1,
      header p,
      footer {
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log(`✅ 폰트 "${fontName}" 로드 및 적용 완료!`);
    console.log(`✅ 현재 적용된 폰트: ${document.body.style.fontFamily}`);
    
  } catch (error) {
    console.error('❌ 폰트 로드 실패:', error);
    console.error('기본 폰트를 사용합니다.');
  }
};

// 폰트 파일명에서 폰트 이름 추출
const extractFontName = (filePath: string): string => {
  // 파일 경로에서 파일명 추출
  const filename = filePath.split('/').pop() || '';
  // 확장자 제거
  let name = filename.replace(/\.(ttf|otf|woff|woff2)$/i, '');
  
  // 특수 패턴 처리
  // NanumSquareRoundR -> Nanum Square Round
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  // 숫자 제거 (R, B, L 등의 스타일 표시는 유지)
  name = name.replace(/\d+/g, '');
  // 하이픈, 언더스코어를 공백으로 변경
  name = name.replace(/[-_]/g, ' ');
  
  // 첫 글자 대문자로 변환
  return name.split(' ')
    .filter(word => word.length > 0)
    .map(word => {
      // 이미 대문자로 시작하는 단어는 그대로 유지 (예: Nanum)
      if (word[0] === word[0].toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ') || 'CustomFont';
};
