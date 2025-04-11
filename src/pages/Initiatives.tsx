
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import InitiativesList from "@/components/initiatives/InitiativesList";
import InitiativeSubmit from "@/components/initiatives/InitiativeSubmit";
import InitiativeTracker from "@/components/initiatives/InitiativeTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, PlusCircle, BarChart2 } from "lucide-react";

const Initiatives = () => {
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <Layout>
      <div className="bg-civic-blue/10 py-10">
        <div className="civic-container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Neighborhood Initiatives</h1>
            <p className="text-civic-gray-dark">
              Browse, submit, and track progress of community-driven initiatives in your area.
            </p>
          </div>

          <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <TabsList className="grid grid-cols-3 gap-4 mb-2">
                <TabsTrigger value="browse" className="flex items-center gap-2">
                  <Lightbulb size={16} />
                  <span>Browse Initiatives</span>
                </TabsTrigger>
                <TabsTrigger value="submit" className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  <span>Submit Initiative</span>
                </TabsTrigger>
                <TabsTrigger value="track" className="flex items-center gap-2">
                  <BarChart2 size={16} />
                  <span>Track Progress</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="browse" className="mt-0">
              <InitiativesList />
            </TabsContent>
            
            <TabsContent value="submit" className="mt-0">
              <InitiativeSubmit />
            </TabsContent>
            
            <TabsContent value="track" className="mt-0">
              <InitiativeTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Initiatives;
