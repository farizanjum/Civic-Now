
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Clock, AlertCircle, CheckCircle, Users, UserCheck } from "lucide-react";

// Sample tracking data
const trackingData = [
  {
    id: "fb-006",
    subject: "New Crosswalk Request",
    category: "Safety",
    submittedDate: "2025-04-08",
    status: "pending",
    representative: {
      name: "Jane Rodriguez",
      role: "City Council",
      avatar: "/placeholder.svg"
    },
    timeline: [
      {
        date: "2025-04-08",
        status: "submitted",
        message: "Feedback submitted successfully."
      }
    ]
  },
  {
    id: "fb-003",
    subject: "Community Center Hours",
    category: "Services",
    submittedDate: "2025-04-01",
    status: "under_review",
    representative: {
      name: "Michael Chen",
      role: "City Council",
      avatar: "/placeholder.svg"
    },
    timeline: [
      {
        date: "2025-04-01",
        status: "submitted",
        message: "Feedback submitted successfully."
      },
      {
        date: "2025-04-03",
        status: "acknowledged",
        message: "Your feedback has been received and is being reviewed."
      },
      {
        date: "2025-04-05",
        status: "under_review",
        message: "Your feedback is currently under review by the Parks Department."
      }
    ]
  },
  {
    id: "fb-002",
    subject: "Traffic Light Timing",
    category: "Transportation",
    submittedDate: "2025-04-03",
    status: "responded",
    representative: {
      name: "David Williams",
      role: "Transportation Authority",
      avatar: "/placeholder.svg"
    },
    timeline: [
      {
        date: "2025-04-03",
        status: "submitted",
        message: "Feedback submitted successfully."
      },
      {
        date: "2025-04-04",
        status: "acknowledged",
        message: "Your feedback has been received and is being reviewed."
      },
      {
        date: "2025-04-05",
        status: "under_review",
        message: "Your feedback is currently under review by the Transportation Department."
      },
      {
        date: "2025-04-06",
        status: "responded",
        message: "A response has been provided to your feedback."
      }
    ]
  }
];

const statusColors: Record<string, string> = {
  "pending": "bg-gray-100 text-gray-800",
  "acknowledged": "bg-blue-100 text-blue-800",
  "under_review": "bg-amber-100 text-amber-800",
  "responded": "bg-green-100 text-green-800",
  "closed": "bg-gray-100 text-gray-800",
  "submitted": "bg-violet-100 text-violet-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  "pending": <Clock size={16} />,
  "acknowledged": <AlertCircle size={16} />,
  "under_review": <Users size={16} />,
  "responded": <CheckCircle size={16} />,
  "closed": <CheckCircle size={16} />,
  "submitted": <MessageCircle size={16} />,
};

const FeedbackTracking = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  
  const filteredItems = selectedTab === "all" 
    ? trackingData 
    : trackingData.filter(item => item.status === selectedTab);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{trackingData.length}</div>
            <p className="text-sm text-civic-gray-dark">Feedback items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{trackingData.filter(item => item.status === "pending").length}</div>
            <Progress value={33} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{trackingData.filter(item => item.status === "under_review").length}</div>
            <Progress value={66} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Responded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{trackingData.filter(item => item.status === "responded").length}</div>
            <Progress value={100} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Feedback Tracking</CardTitle>
              <CardDescription>Monitor the status of your submitted feedback</CardDescription>
            </div>
            <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="under_review">Reviewing</TabsTrigger>
                <TabsTrigger value="responded">Responded</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MessageCircle size={48} className="text-civic-gray mb-4" />
              <p className="text-civic-gray-dark">No feedback items to display.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredItems.map(item => (
                <div key={item.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{item.subject}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge className={statusColors[item.status]}>
                          {item.status === "under_review" ? "Under Review" : 
                            item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          ID: {item.id}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">Assigned to</p>
                        <p className="text-sm text-civic-gray-dark">{item.representative.name}</p>
                        <p className="text-xs text-civic-gray">{item.representative.role}</p>
                      </div>
                      <Avatar className="h-10 w-10">
                        <img src={item.representative.avatar} alt={item.representative.name} />
                      </Avatar>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 mt-6">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    {item.timeline.map((event, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="absolute left-0 w-0.5">
                          <div className={`absolute -left-1.5 -top-1.5 h-4 w-4 rounded-full border-2 border-white ${
                            statusColors[event.status].split(' ')[0]
                          }`} />
                        </div>
                        <div className="ml-6">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${statusColors[event.status]} flex items-center gap-1`}>
                              {statusIcons[event.status]}
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                            <span className="text-sm text-civic-gray-dark">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-civic-gray-dark">{event.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackTracking;
