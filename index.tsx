
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { loadCustomFonts } from './utils/fontLoader';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 폰트 로드 후 앱 렌더링
loadCustomFonts().then(() => {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('폰트 로드 실패, 기본 폰트로 계속:', error);
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
