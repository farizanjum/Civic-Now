
# Receipt OCR API

This API uses Mistral AI's Document OCR capabilities to extract structured data from receipts and invoices.

## Setup

1. Install Python 3.9 or higher
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   Alternatively, you can use the provided bash script:
   ```
   chmod +x start.sh
   ./start.sh
   ```

## API Usage

### POST /ocr

Process a receipt image and extract structured data.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - `file`: The receipt image or PDF file
  - `api_key`: Your Mistral AI API key

**Response:**
```json
{
  "merchant": "City Hardware Store",
  "date": "2025-04-10",
  "amount": 125.67,
  "items": [
    { "name": "Item 1", "price": 45.99 },
    { "name": "Item 2", "price": 79.68 },
    { "name": "Tax", "price": 8.99 }
  ],
  "raw_text": "RECEIPT\nCity Hardware Store\n123 Main St\nDate: 04/10/2025\nItem 1: $45.99\nItem 2: $79.68\nTax: $8.99\nTotal: $125.67\nThank you for shopping with us!"
}
```

## Security Considerations

- The API key is never stored on the server; it's only used for the current request to the Mistral AI API.
- In a production environment, consider implementing additional security measures such as API key validation, rate limiting, and proper CORS configuration.
