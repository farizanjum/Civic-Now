
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, BarChart2, Calendar, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BudgetOcrUploader from "@/components/budget/BudgetOcrUploader";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetHistory from "@/components/budget/BudgetHistory";

const Budget = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <Layout>
      <div className="bg-civic-blue/10 py-10">
        <div className="civic-container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Budget Tracking</h1>
            <p className="text-civic-gray-dark">
              Track and analyze community budget spending with receipt scanning technology.
            </p>
          </div>

          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <TabsList className="grid grid-cols-3 gap-4 mb-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Receipt</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <BarChart2 size={16} />
                  <span>Budget Summary</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upload" className="mt-0">
              <BudgetOcrUploader />
            </TabsContent>
            
            <TabsContent value="summary" className="mt-0">
              <BudgetSummary />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <BudgetHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Budget;
