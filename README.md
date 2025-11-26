<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ZFVlsWlbvgzeZd9H67MaH1yiscQs0i-q

## Run Locally

**Prerequisites:**  Node.js, Python 3.8+

### 프론트엔드 실행

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   VITE_DONUT_API_URL=http://localhost:5000
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

### 백엔드 실행 (영수증 OCR 강화)

영수증 분석 기능을 강화하기 위해 Donut OCR 모델을 사용하는 Python 백엔드를 실행하세요:

1. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the backend server:
   ```bash
   python app.py
   ```

백엔드 서버는 `http://localhost:5000`에서 실행됩니다.

**참고:** 백엔드가 실행되지 않아도 프론트엔드는 작동하지만, 영수증 분석은 Gemini Vision만 사용됩니다. Donut OCR을 사용하려면 백엔드를 실행해야 합니다.
