
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import httpx
import base64
from pydantic import BaseModel
from typing import List, Optional
import json
import re
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    price: float

class OcrResponse(BaseModel):
    merchant: Optional[str] = None
    date: Optional[str] = None
    amount: Optional[float] = None
    items: List[Item] = []
    raw_text: str

@app.post("/ocr", response_model=OcrResponse)
async def process_receipt(
    file: UploadFile = File(...),
    api_key: str = Form(...)
):
    # Validate API key is provided
    if not api_key:
        raise HTTPException(status_code=400, detail="API key is required")
    
    # Read the uploaded file content
    file_content = await file.read()
    
    # Convert file to base64
    base64_encoded = base64.b64encode(file_content).decode("utf-8")
    
    # Prepare request to Mistral AI
    file_mime_type = file.content_type or "application/octet-stream"
    
    # Create the data format expected by Mistral AI's document OCR
    mistral_payload = {
        "document": f"data:{file_mime_type};base64,{base64_encoded}",
        "mode": "detailed"  # Use detailed mode for more structured extraction
    }
    
    # Send request to Mistral AI
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.mistral.ai/v1/document/ocr",
                json=mistral_payload,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                timeout=30.0  # OCR might take some time
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Mistral API error: {response.text}"
                )
                
            result = response.json()
            raw_text = result.get("text", "")
            
            # Process the OCR text to extract structured information
            extracted_data = extract_receipt_data(raw_text)
            extracted_data["raw_text"] = raw_text
            
            return extracted_data
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with Mistral AI: {str(e)}")

def extract_receipt_data(text: str) -> dict:
    """Extract structured data from receipt text"""
    # Initialize with default values
    data = {
        "merchant": None,
        "date": None,
        "amount": None,
        "items": []
    }
    
    lines = text.strip().split('\n')
    
    # Try to extract merchant name (usually in the first few lines)
    for i in range(min(3, len(lines))):
        if lines[i] and lines[i].strip() != "RECEIPT":
            data["merchant"] = lines[i].strip()
            break
    
    # Find date
    date_patterns = [
        r'Date: (\d{1,2}/\d{1,2}/\d{2,4})',
        r'Date: (\d{1,2}-\d{1,2}-\d{2,4})',
        r'Date: (\d{4}-\d{2}-\d{2})',
        r'(\d{1,2}/\d{1,2}/\d{2,4})',
        r'(\d{2}-\d{2}-\d{4})'
    ]
    
    for pattern in date_patterns:
        date_matches = re.findall(pattern, text)
        if date_matches:
            try:
                # Try to parse and standardize the date format
                if '/' in date_matches[0]:
                    parts = date_matches[0].split('/')
                    if len(parts[2]) == 2:  # Handle 2-digit years
                        parts[2] = f"20{parts[2]}"
                    date_obj = datetime(int(parts[2]), int(parts[0]), int(parts[1]))
                    data["date"] = date_obj.strftime("%Y-%m-%d")
                elif '-' in date_matches[0]:
                    date_obj = datetime.strptime(date_matches[0], "%m-%d-%Y")
                    data["date"] = date_obj.strftime("%Y-%m-%d")
                break
            except (ValueError, IndexError):
                continue
    
    # Find total amount
    amount_patterns = [
        r'Total: \$?(\d+\.\d+)',
        r'TOTAL\s+\$?(\d+\.\d+)',
        r'Amount: \$?(\d+\.\d+)',
        r'AMOUNT\s+\$?(\d+\.\d+)',
        r'Total\s+\$?(\d+\.\d+)'
    ]
    
    for pattern in amount_patterns:
        amount_matches = re.findall(pattern, text, re.IGNORECASE)
        if amount_matches:
            try:
                data["amount"] = float(amount_matches[0])
                break
            except (ValueError, IndexError):
                continue
    
    # Extract items and prices
    item_patterns = [
        r'([A-Za-z0-9\s]+)\.{2,}\s*\$?(\d+\.\d+)',  # Item..... $XX.XX
        r'([A-Za-z0-9\s]+)\s+\$?(\d+\.\d+)',        # Item     $XX.XX
        r'([A-Za-z0-9\s]+):\s*\$?(\d+\.\d+)'        # Item: $XX.XX
    ]
    
    for line in lines:
        for pattern in item_patterns:
            matches = re.findall(pattern, line)
            if matches:
                for match in matches:
                    item_name = match[0].strip()
                    if item_name.lower() not in ["total", "subtotal", "tax", "amount"]:
                        try:
                            price = float(match[1])
                            data["items"].append({"name": item_name, "price": price})
                        except (ValueError, IndexError):
                            continue
    
    # If we find "Tax" specifically, add it as a separate item
    tax_patterns = [
        r'Tax:?\s*\$?(\d+\.\d+)',
        r'TAX\s+\$?(\d+\.\d+)'
    ]
    
    for pattern in tax_patterns:
        tax_matches = re.findall(pattern, text, re.IGNORECASE)
        if tax_matches:
            try:
                data["items"].append({"name": "Tax", "price": float(tax_matches[0])})
                break
            except (ValueError, IndexError):
                continue
    
    return data

@app.get("/")
async def root():
    return {"message": "Receipt OCR API is running"}
