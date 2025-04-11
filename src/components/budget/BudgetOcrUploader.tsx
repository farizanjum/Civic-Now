
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, Receipt } from "lucide-react";

interface OcrResponse {
  merchant: string;
  date: string;
  amount: number;
  items: Array<{ name: string; price: number }>;
  raw_text: string;
}

const BudgetOcrUploader = ({ onReceiptProcessed }: { onReceiptProcessed: (data: OcrResponse) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hardcoded API key instead of asking users to provide it
  const API_KEY = "eqYmr8jPuzR9S2Pjq3frG1u0wyVmxXoY";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a receipt image to upload.");
      return;
    }
    
    setIsUploading(true);
    
    // Create FormData for the file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", API_KEY);
    
    try {
      // Backend API URL
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error processing receipt: ${errorText}`);
      }
      
      const data: OcrResponse = await response.json();
      
      toast.success("Receipt processed successfully!");
      
      onReceiptProcessed(data);
      resetForm();
      
    } catch (error) {
      console.error("Error processing receipt:", error);
      toast.error(error instanceof Error ? error.message : "Error processing receipt. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Receipt</CardTitle>
        <CardDescription>
          Upload a receipt image to extract expense information automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receipt-file">Receipt Image</Label>
            <Input
              id="receipt-file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              disabled={isUploading}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Receipt className="mr-2 h-4 w-4" />
                Process Receipt
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col text-center text-xs text-muted-foreground">
        <p>
          Your receipt will be processed securely. We use AI for text extraction.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BudgetOcrUploader;
