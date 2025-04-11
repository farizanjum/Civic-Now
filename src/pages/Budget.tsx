
import React, { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, BarChart, Receipt } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import NeighborhoodNotifications from "@/components/notifications/NeighborhoodNotifications";
import PlainLanguageSummary from "@/components/legislation/PlainLanguageSummary";
import ImpactVisualization from "@/components/impact/ImpactVisualization";

// Sample data for legislation summary
const sampleLegislationData = {
  title: "Public Parks Maintenance Budget Allocation",
  originalText: "WHEREAS, pursuant to Section 10(a) of the Municipal Parks Act, the City Council is authorized to allocate funds for the maintenance and improvement of public recreational spaces; and\n\nWHEREAS, the Department of Parks and Recreation has submitted a proposed budget of Rs. 2.5 crore for the fiscal year 2023-2024 for maintenance activities including landscaping, facility repairs, and safety improvements; and\n\nWHEREAS, the Finance Committee has reviewed the proposal and found it to be reasonable and necessary for the continued operation and improvement of the city's public parks;\n\nNOW, THEREFORE, BE IT RESOLVED by the City Council of Bengaluru that:\n\n1. The sum of Rs. 2.5 crore is hereby allocated from the general fund to the Department of Parks and Recreation for the maintenance and improvement of public parks for the fiscal year 2023-2024.\n\n2. The Director of Parks and Recreation shall submit quarterly reports to the City Council detailing the expenditure of these funds.\n\n3. Any unexpended funds at the end of the fiscal year shall be returned to the general fund unless otherwise authorized by the City Council.",
  plainSummary: "This legislation approves Rs. 2.5 crore (25 million rupees) for maintaining and improving public parks in Bengaluru during 2023-2024. The money will be used for landscaping, repairs, and safety improvements. The Parks Department must report how they spend the money every three months, and any leftover funds must be returned at the end of the year unless the City Council allows them to keep it.",
  impacts: {
    positive: [
      "Better maintained parks for recreation",
      "Improved safety features for children",
      "Enhanced green spaces throughout the city",
      "Potential increase in property values near parks"
    ],
    negative: [
      "Temporary park closures during improvements",
      "Potential noise from maintenance work",
      "Some funds diverted from other city services"
    ],
    uncertain: [
      "Long-term sustainability of maintenance plans",
      "Equal distribution of improvements across neighborhoods",
      "Impact on water usage for landscaping during dry seasons"
    ]
  },
  status: "passed" as const,
  date: "March 15, 2023",
  category: "Budget Allocation"
};

const Budget = () => {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.info(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!apiKey) {
      toast.error("Please enter your Mistral API key");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setUploadResult(result);
      setActiveTab('results');
      toast.success("Receipt processed successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process receipt. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="civic-container py-8">
        <h1 className="text-3xl font-bold text-civic-blue mb-8">Community Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Tracking Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Receipt className="mr-2 h-6 w-6" /> 
                  Budget Document Scanner
                </CardTitle>
                <CardDescription>
                  Upload receipts, invoices, or budget documents to automatically extract and organize financial information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" /> 
                      Upload Document
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center" disabled={!uploadResult}>
                      <FileText className="h-4 w-4 mr-2" /> 
                      Extracted Data
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload a document</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Supported formats: JPG, PNG, PDF
                        </p>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload">
                          <Button variant="outline" className="mr-4">
                            Browse Files
                          </Button>
                        </label>
                        {file && (
                          <span className="text-sm font-medium text-gray-700">
                            {file.name}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                            Mistral API Key
                          </label>
                          <input
                            type="password"
                            id="api-key"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-civic-blue focus:border-civic-blue"
                            placeholder="Enter your Mistral API key"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Your API key is only used for this request and is never stored.
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleUpload} 
                          disabled={!file || !apiKey || isUploading}
                          className="w-full"
                        >
                          {isUploading ? "Processing..." : "Process Document"}
                        </Button>
                        
                        <Alert>
                          <AlertTitle>How it works</AlertTitle>
                          <AlertDescription>
                            We use Mistral AI's Document OCR to extract information from your uploaded document.
                            Your document is processed securely, and the extracted data is formatted for easy review.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results" className="pt-6">
                    {uploadResult && (
                      <div className="space-y-6">
                        <Alert className="bg-green-50 border-green-100">
                          <AlertTitle className="text-green-800">Document Successfully Processed</AlertTitle>
                          <AlertDescription className="text-green-700">
                            We've extracted the following information from your document.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                          <h3 className="text-lg font-semibold mb-4 text-civic-blue">Extracted Information</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Merchant</h4>
                              <p className="text-lg font-medium">{uploadResult.merchant || "Not detected"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                              <p className="text-lg font-medium">{uploadResult.date || "Not detected"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h4>
                              <p className="text-lg font-medium">
                                {uploadResult.amount ? `₹${uploadResult.amount.toFixed(2)}` : "Not detected"}
                              </p>
                            </div>
                          </div>
                          
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                          {uploadResult.items && uploadResult.items.length > 0 ? (
                            <div className="border rounded-md overflow-hidden mb-6">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Item
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Price
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {uploadResult.items.map((item: any, index: number) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.name}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        ₹{item.price.toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 mb-6">No items detected</p>
                          )}
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Raw Text</h4>
                            <div className="bg-gray-50 p-4 rounded-md text-sm font-mono text-gray-700 max-h-60 overflow-y-auto whitespace-pre-line">
                              {uploadResult.raw_text}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => setActiveTab('upload')}>
                              Scan Another Document
                            </Button>
                            <Button>
                              Save to Budget Records
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Legislation Impact */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-civic-blue">Legislation Impact</h2>
              <PlainLanguageSummary 
                title={sampleLegislationData.title}
                originalText={sampleLegislationData.originalText}
                plainSummary={sampleLegislationData.plainSummary}
                impacts={sampleLegislationData.impacts}
                status={sampleLegislationData.status}
                date={sampleLegislationData.date}
                category={sampleLegislationData.category}
              />
            </div>
            
            {/* Impact Visualization */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-civic-blue">Community Impact</h2>
              <ImpactVisualization />
            </div>
          </div>
          
          {/* Sidebar - Right 1/3 */}
          <div className="space-y-8">
            <NeighborhoodNotifications />
            
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
                    <BarChart className="h-6 w-6 mb-2" />
                    <span>Budget Reports</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Submit Feedback</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
                    <Upload className="h-6 w-6 mb-2" />
                    <span>Upload Document</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 text-center">
                    <Receipt className="h-6 w-6 mb-2" />
                    <span>View All Records</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Budget;
