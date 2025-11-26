// Donut OCR service for receipt text extraction
const DONUT_API_URL = import.meta.env.VITE_DONUT_API_URL || 'http://localhost:5000';

export const extractReceiptText = async (
    image: { mimeType: string; data: string }
): Promise<string> => {
    try {
        const response = await fetch(`${DONUT_API_URL}/analyze-receipt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: `data:${image.mimeType};base64,${image.data}`
            }),
        });

        if (!response.ok) {
            throw new Error(`Donut API error: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.success || !result.extracted_text) {
            throw new Error('Failed to extract text from receipt');
        }

        return result.extracted_text;
    } catch (error) {
        console.error('Error calling Donut API:', error);
        throw error;
    }
};

