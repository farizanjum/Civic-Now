import React, { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Receipt, FileText } from "lucide-react";
import NeighborhoodNotifications from "@/components/notifications/NeighborhoodNotifications";
import PlainLanguageSummary from "@/components/legislation/PlainLanguageSummary";
import ImpactVisualization from "@/components/impact/ImpactVisualization";
import BudgetOcrUploader from "@/components/budget/BudgetOcrUploader";
import BudgetSummary from "@/components/budget/BudgetSummary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BudgetItemForm } from "@/components/budget/BudgetItemForm";

// Sample data for legislation summary with Indian context
const sampleLegislationData = {
  title: "Public Parks Maintenance Budget Allocation",
  originalText: "WHEREAS, pursuant to Section 10(a) of the Municipal Parks Act, the City Council of Bengaluru is authorized to allocate funds for the maintenance and improvement of public recreational spaces; and\n\nWHEREAS, the Department of Parks and Recreation has submitted a proposed budget of ₹2.5 crore for the fiscal year 2023-2024 for maintenance activities including landscaping, facility repairs, and safety improvements; and\n\nWHEREAS, the Finance Committee has reviewed the proposal and found it to be reasonable and necessary for the continued operation and improvement of the city's public parks;\n\nNOW, THEREFORE, BE IT RESOLVED by the City Council of Bengaluru that:\n\n1. The sum of ₹2.5 crore is hereby allocated from the general fund to the Department of Parks and Recreation for the maintenance and improvement of public parks for the fiscal year 2023-2024.\n\n2. The Director of Parks and Recreation shall submit quarterly reports to the BBMP (Bruhat Bengaluru Mahanagara Palike) detailing the expenditure of these funds.\n\n3. Any unexpended funds at the end of the fiscal year shall be returned to the general fund unless otherwise authorized by the City Council.",
  plainSummary: "This legislation approves ₹2.5 crore (25 million rupees) for maintaining and improving public parks in Bengaluru during 2023-2024. The money will be used for landscaping, repairs, and safety improvements. The Parks Department must report how they spend the money every three months to the BBMP, and any leftover funds must be returned at the end of the year unless the City Council allows them to keep it.",
  impacts: {
    positive: [
      "Better maintained parks for recreation",
      "Improved safety features for children at parks like Cubbon Park and Lalbagh",
      "Enhanced green spaces throughout Bengaluru",
      "Potential increase in property values near parks"
    ],
    negative: [
      "Temporary park closures during improvements",
      "Potential noise from maintenance work in residential areas like Indiranagar",
      "Some funds diverted from other city services like road maintenance"
    ],
    uncertain: [
      "Long-term sustainability of maintenance plans during monsoon season",
      "Equal distribution of improvements across neighborhoods in North and South Bengaluru",
      "Impact on water usage for landscaping during dry seasons and water shortages"
    ]
  },
  status: "passed" as const,
  date: "March 15, 2023",
  category: "Budget Allocation"
};

interface OcrResponse {
  merchant: string;
  date: string;
  amount: number;
  items: Array<{ name: string; price: number }>;
  raw_text: string;
}

const Budget = () => {
  const [processedReceipt, setProcessedReceipt] = useState<OcrResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReceiptProcessed = (data: OcrResponse) => {
    setProcessedReceipt(data);
    setIsDialogOpen(true);
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
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center">
                      Upload & Scan
                    </TabsTrigger>
                    <TabsTrigger value="summary" className="flex items-center">
                      Budget Summary
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="pt-6">
                    <BudgetOcrUploader onReceiptProcessed={handleReceiptProcessed} />
                  </TabsContent>
                  
                  <TabsContent value="summary" className="pt-6">
                    <BudgetSummary />
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
                    <Receipt className="h-6 w-6 mb-2" />
                    <span>Track Expenses</span>
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
        
        {/* Dialog for displaying the form after receipt processing */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
            </DialogHeader>
            {processedReceipt && (
              <BudgetItemForm 
                initialData={{
                  amount: processedReceipt.amount,
                  date: processedReceipt.date,
                  merchant: processedReceipt.merchant,
                  items: processedReceipt.items,
                  rawText: processedReceipt.raw_text
                }} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Budget;
