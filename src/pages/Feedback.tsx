
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  List, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter
} from "lucide-react";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackList from "@/components/feedback/FeedbackList";
import FeedbackTracking from "@/components/feedback/FeedbackTracking";

const Feedback = () => {
  const [activeTab, setActiveTab] = useState("submit");
  
  return (
    <Layout>
      <div className="bg-civic-blue/10 py-10">
        <div className="civic-container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Direct Feedback</h1>
            <p className="text-civic-gray-dark">
              Share your thoughts directly with representatives and track their responses.
            </p>
          </div>

          <Tabs defaultValue="submit" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <TabsList className="grid grid-cols-3 gap-4 mb-2">
                <TabsTrigger value="submit" className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>Submit Feedback</span>
                </TabsTrigger>
                <TabsTrigger value="public" className="flex items-center gap-2">
                  <List size={16} />
                  <span>Public Feedback</span>
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Response Tracking</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="submit" className="mt-0">
              <FeedbackForm />
            </TabsContent>
            
            <TabsContent value="public" className="mt-0">
              <FeedbackList />
            </TabsContent>
            
            <TabsContent value="tracking" className="mt-0">
              <FeedbackTracking />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
