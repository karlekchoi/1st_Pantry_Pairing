from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from PIL import Image
import base64
import io
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize Donut model for receipt OCR
print("Loading Donut model...")
donut_pipe = pipeline("image-to-text", model="naver-clova-ix/donut-base")
print("Donut model loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/analyze-receipt', methods=['POST'])
def analyze_receipt():
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode base64 image
        image_data = data['image']
        if ',' in image_data:
            # Remove data URL prefix if present
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Use Donut to extract text from receipt
        result = donut_pipe(image)
        
        # Extract text from result
        extracted_text = result[0]['generated_text'] if isinstance(result, list) and len(result) > 0 else str(result)
        
        return jsonify({
            "success": True,
            "extracted_text": extracted_text
        })
    
    except Exception as e:
        print(f"Error analyzing receipt: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

