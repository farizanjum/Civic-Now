
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLegislation from "@/components/admin/AdminLegislation";
import AdminVoting from "@/components/admin/AdminVoting";
import AdminInitiatives from "@/components/admin/AdminInitiatives";
import AdminFeedback from "@/components/admin/AdminFeedback";
import AdminUsers from "@/components/admin/AdminUsers";
import { LucideLayoutDashboard, FileText, Vote, Lightbulb, MessageSquare, Users, Settings } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LucideLayoutDashboard },
    { id: "legislation", label: "Legislation", icon: FileText },
    { id: "voting", label: "Voting", icon: Vote },
    { id: "initiatives", label: "Initiatives", icon: Lightbulb },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <Layout>
      <div className="bg-civic-blue/5 py-8 min-h-screen">
        <div className="civic-container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-civic-gray-dark">
              Manage and monitor all aspects of the civic platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            {/* Sidebar Navigation - Visible on larger screens */}
            <div className="hidden lg:block">
              <Card className="sticky top-6">
                <CardContent className="p-0">
                  <div className="space-y-1 p-2">
                    {menuItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors ${
                          activeTab === item.id
                            ? "bg-civic-blue text-white font-medium"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Mobile Navigation - Tab style for smaller screens */}
              <div className="lg:hidden bg-white rounded-lg p-4 shadow-sm overflow-x-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start">
                    {menuItems.map(item => (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className="flex items-center gap-1.5 min-w-max"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "dashboard" && <AdminDashboard />}
                {activeTab === "legislation" && <AdminLegislation />}
                {activeTab === "voting" && <AdminVoting />}
                {activeTab === "initiatives" && <AdminInitiatives />}
                {activeTab === "feedback" && <AdminFeedback />}
                {activeTab === "users" && <AdminUsers />}
                {activeTab === "settings" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Settings</CardTitle>
                      <CardDescription>Configure system-wide settings and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Settings content will be implemented here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
