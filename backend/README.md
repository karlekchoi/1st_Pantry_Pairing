# Donut OCR Backend

영수증 이미지에서 텍스트를 추출하기 위한 Python 백엔드 서버입니다.

## 설치

```bash
cd backend
pip install -r requirements.txt
```

## 실행

```bash
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### POST /analyze-receipt

영수증 이미지를 분석하여 텍스트를 추출합니다.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "success": true,
  "extracted_text": "추출된 텍스트..."
}
```

## 환경 변수

- `PORT`: 서버 포트 (기본값: 5000)

