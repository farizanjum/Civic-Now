
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Receipt, Key } from "lucide-react";

interface OcrResponse {
  merchant: string;
  date: string;
  amount: number;
  items: Array<{ name: string; price: number }>;
  raw_text: string;
}

const BudgetOcrUploader = ({ onReceiptProcessed }: { onReceiptProcessed: (data: OcrResponse) => void }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiKeyInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
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
      toast({
        description: "Please select a receipt image to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        description: "Please enter your API key.",
        variant: "destructive",
      });
      apiKeyInputRef.current?.focus();
      return;
    }
    
    setIsUploading(true);
    
    // Create FormData for the file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    
    try {
      // Replace with your actual backend URL
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error processing receipt: ${errorText}`);
      }
      
      const data: OcrResponse = await response.json();
      
      toast({
        description: "Receipt processed successfully!",
      });
      
      onReceiptProcessed(data);
      resetForm();
      
    } catch (error) {
      console.error("Error processing receipt:", error);
      toast({
        description: error instanceof Error ? error.message : "Error processing receipt. Please try again.",
        variant: "destructive",
      });
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
          
          <div className="space-y-2">
            <Label htmlFor="api-key">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>Mistral AI API Key</span>
              </div>
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Mistral API key"
              ref={apiKeyInputRef}
              value={apiKey}
              onChange={handleApiKeyChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is only used for this request and not stored.
            </p>
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
          Your receipt will be processed securely. We use Mistral AI for text extraction.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BudgetOcrUploader;
