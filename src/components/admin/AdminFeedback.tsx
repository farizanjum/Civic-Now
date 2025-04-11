
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, MessageSquare, Send, Check, Clock, X, AlertCircle, ArrowUpRight } from "lucide-react";

// Mock data for feedback
const mockFeedback = [
  {
    id: "F1",
    title: "Crosswalk Safety Concerns",
    status: "New",
    priority: "High",
    category: "Safety",
    sender: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg",
    },
    receivedDate: "2025-03-15",
    content: "The crosswalk at Oak and Maple is very dangerous. Cars rarely stop, and the paint is faded. Can we get better signage and repaint the lines?",
    isPublic: true,
    responses: [],
  },
  {
    id: "F2",
    title: "Park Maintenance Issue",
    status: "In Progress",
    priority: "Medium",
    category: "Parks",
    sender: {
      name: "Michelle Garcia",
      avatar: "/placeholder.svg",
    },
    receivedDate: "2025-03-10",
    content: "The playground equipment at Riverside Park is in need of repair. Several swings are broken and there's rust on the metal structures.",
    isPublic: true,
    responses: [
      {
        author: "Parks Department",
        content: "Thank you for your feedback. We have scheduled an inspection for next week.",
        date: "2025-03-12",
      }
    ],
  },
  {
    id: "F3",
    title: "Street Lighting Request",
    status: "Resolved",
    priority: "Medium",
    category: "Infrastructure",
    sender: {
      name: "Robert Johnson",
      avatar: "/placeholder.svg",
    },
    receivedDate: "2025-02-28",
    content: "Our street has inadequate lighting, making it unsafe at night. Can additional street lights be installed along Pine Avenue?",
    isPublic: true,
    responses: [
      {
        author: "Public Works",
        content: "We've reviewed your request and approved the installation of 3 new street lights along Pine Avenue.",
        date: "2025-03-05",
      },
      {
        author: "Public Works",
        content: "Installation of the new street lights has been completed. Please let us know if the lighting is now sufficient.",
        date: "2025-03-15",
      }
    ],
  },
  {
    id: "F4",
    title: "Noise Complaint",
    status: "New",
    priority: "Low",
    category: "Noise",
    sender: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg",
    },
    receivedDate: "2025-03-16",
    content: "There is excessive noise coming from construction at the corner lot on Elm Street, starting before 7 AM and continuing until after 8 PM.",
    isPublic: false,
    responses: [],
  },
  {
    id: "F5",
    title: "Community Center Suggestion",
    status: "In Progress",
    priority: "Low",
    category: "Community Services",
    sender: {
      name: "David Chen",
      avatar: "/placeholder.svg",
    },
    receivedDate: "2025-03-08",
    content: "I'd like to suggest adding more senior programs at the community center, particularly in the mornings. Many seniors in our community would benefit.",
    isPublic: true,
    responses: [
      {
        author: "Community Services",
        content: "Thank you for your suggestion. We're currently evaluating our programming schedule and will consider adding more senior-focused activities.",
        date: "2025-03-11",
      }
    ],
  }
];

const AdminFeedback = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  
  // Filter feedback based on tab, search term and status
  const filteredFeedback = mockFeedback.filter((feedback) => {
    // First apply tab filter
    if (activeTab === "new" && feedback.status !== "New") return false;
    if (activeTab === "inProgress" && feedback.status !== "In Progress") return false;
    if (activeTab === "resolved" && feedback.status !== "Resolved") return false;
    
    // Then apply search and status filters
    return (
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || feedback.status === statusFilter)
    );
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleRespond = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsResponseDialogOpen(true);
  };
  
  const submitResponse = () => {
    if (!responseText.trim()) {
      toast({
        title: "Error",
        description: "Response text cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Sending response:", {
      feedbackId: selectedFeedback.id,
      response: responseText,
    });
    
    // Close dialog and reset
    setIsResponseDialogOpen(false);
    setResponseText("");
    
    toast({
      title: "Response Sent",
      description: "Your response has been sent successfully.",
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <AlertCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Resolved":
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Community Feedback</CardTitle>
            <CardDescription>Manage and respond to feedback from community members</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border rounded-md">
                {filteredFeedback.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No feedback found matching your criteria.</p>
                  </div>
                ) : (
                  filteredFeedback.map((feedback) => (
                    <div key={feedback.id} className="border-b last:border-b-0">
                      <div className="p-4 hover:bg-muted/50">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={feedback.sender.avatar} alt={feedback.sender.name} />
                            <AvatarFallback>{feedback.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                              <h3 className="font-medium">{feedback.title}</h3>
                              <div className="text-xs text-muted-foreground">
                                {new Date(feedback.receivedDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge className={getStatusColor(feedback.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(feedback.status)}
                                  {feedback.status}
                                </span>
                              </Badge>
                              <Badge className={getPriorityColor(feedback.priority)}>
                                {feedback.priority} Priority
                              </Badge>
                              <Badge variant="outline">{feedback.category}</Badge>
                              {!feedback.isPublic && (
                                <Badge variant="secondary">Private</Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {feedback.content}
                            </p>
                            
                            <div className="flex flex-wrap justify-between items-center">
                              <div className="text-sm">
                                From: <span className="font-medium">{feedback.sender.name}</span>
                              </div>
                              
                              <div className="flex gap-2 mt-2 sm:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center"
                                  onClick={() => handleRespond(feedback)}
                                >
                                  <Send className="h-3.5 w-3.5 mr-1" />
                                  Respond
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center"
                                >
                                  <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                  View Full
                                </Button>
                              </div>
                            </div>
                            
                            {/* Show the most recent response if available */}
                            {feedback.responses.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex items-start gap-2">
                                  <div className="bg-muted rounded-full p-1.5">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <p className="text-xs font-medium">
                                        {feedback.responses[feedback.responses.length - 1].author}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(feedback.responses[feedback.responses.length - 1].date).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {feedback.responses[feedback.responses.length - 1].content}
                                    </p>
                                  </div>
                                </div>
                                
                                {feedback.responses.length > 1 && (
                                  <p className="text-xs text-muted-foreground mt-1 text-right">
                                    +{feedback.responses.length - 1} earlier {feedback.responses.length - 1 === 1 ? "response" : "responses"}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Your response will be sent to the community member and added to the public record if the feedback is public.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="font-medium text-sm mb-1">{selectedFeedback.title}</p>
                <p className="text-xs text-muted-foreground">{selectedFeedback.content}</p>
              </div>
              
              <Textarea
                placeholder="Type your response here..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-32"
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitResponse}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFeedback;
