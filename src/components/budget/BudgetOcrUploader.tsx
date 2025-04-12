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
    
    // Instead of real API call, use hardcoded data
    setTimeout(() => {
      // Hardcoded data that was requested
      const hardcodedResponse: OcrResponse = {
        merchant: "National Budget Office",
        date: "2025-04-12",
        amount: 14600000000,
        items: [
          { name: "Budget Line Item 1", price: 5000000000 },
          { name: "Budget Line Item 2", price: 7500000000 },
          { name: "Budget Line Item 3", price: 1000000000 },
          { name: "Budget Line Item 4", price: 500000000 },
          { name: "Budget Line Item 5", price: 600000000 }
        ],
        raw_text: "50,00,00,000rs\n75,00,00,000rs\n10,00,00,000rs\n5,00,00,000rs\n6,00,00,000rs\n1\n1\n1\n1\n1\n50,00,00,000rs\n75,00,00,000rs\n10,00,00,000rs\n5,00,00,000rs\n6,00,00,000rs\nSUBTOTAL\n1,46,00,00,000 rs\nTax\nTOTAL\n0%\n1,46,00,00,000 rs"
      };
      
      toast.success("Receipt processed successfully!");
      
      onReceiptProcessed(hardcodedResponse);
      resetForm();
      setIsUploading(false);
    }, 2000); // Simulate processing delay
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
