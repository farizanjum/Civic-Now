
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, Check, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { BudgetItemForm } from "./BudgetItemForm";

interface ProcessedData {
  amount: number | null;
  date: string | null;
  merchant: string | null;
  rawText: string;
}

const BudgetOcrUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Clear any previous results
      setProcessedData(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
      
      // Clear any previous results
      setProcessedData(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImagePreview(null);
    setProcessedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProcessImage = () => {
    if (!file) return;
    
    setProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      // Mocked OCR response
      const mockData: ProcessedData = {
        amount: 125.67,
        date: "2025-04-10",
        merchant: "City Hardware Store",
        rawText: "RECEIPT\nCity Hardware Store\n123 Main St\nDate: 04/10/2025\nItem 1: $45.99\nItem 2: $79.68\nTax: $8.99\nTotal: $125.67\nThank you for shopping with us!"
      };
      
      setProcessedData(mockData);
      setProcessing(false);
      
      toast({
        title: "Receipt Processed",
        description: "We've extracted the information from your receipt.",
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Receipt</CardTitle>
          <CardDescription>
            Upload a receipt image to extract budget information automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              imagePreview ? "border-civic-blue" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!imagePreview ? (
              <div className="flex flex-col items-center justify-center py-4">
                <UploadCloud size={48} className="text-civic-gray mb-4" />
                <p className="mb-2 text-civic-gray-dark">
                  <span className="font-medium">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-civic-gray mb-4">
                  PNG, JPG or PDF (max 5MB)
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-civic-blue hover:bg-civic-blue-dark"
                >
                  Select File
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 rounded-full bg-white shadow-md"
                  onClick={handleRemoveFile}
                >
                  <X size={16} />
                </Button>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-h-64 overflow-hidden rounded-md mb-3">
                    <img
                      src={imagePreview}
                      alt="Receipt preview"
                      className="mx-auto object-contain max-h-64"
                    />
                  </div>
                  <div className="flex items-center text-sm text-civic-gray-dark">
                    <FileText size={16} className="mr-2" />
                    <span>{file?.name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleProcessImage}
              disabled={!file || processing}
              className="bg-civic-blue hover:bg-civic-blue-dark"
            >
              {processing && <Loader2 size={16} className="mr-2 animate-spin" />}
              {processing ? "Processing..." : "Extract Information"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>
            Review and verify the information extracted from your receipt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="animate-spin text-civic-blue mb-4" />
              <p className="text-civic-gray-dark">Processing your receipt...</p>
            </div>
          ) : processedData ? (
            <BudgetItemForm initialData={processedData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText size={48} className="text-civic-gray mb-4" />
              <p className="text-civic-gray-dark mb-2">No data extracted yet</p>
              <p className="text-sm text-civic-gray">
                Upload and process a receipt to see the extracted information here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOcrUploader;
