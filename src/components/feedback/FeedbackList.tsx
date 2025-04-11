
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ThumbsUp, MessageCircle, Calendar } from "lucide-react";

// Sample feedback data
const feedbackData = [
  {
    id: "fb-001",
    subject: "Park Maintenance Issues",
    message: "The playground equipment at Central Park is in desperate need of repair. Several swings are broken, and there's graffiti on the slides. This creates both safety issues for children and affects the neighborhood appeal.",
    category: "Maintenance",
    submittedBy: "Alex Rivera",
    avatar: "/placeholder.svg",
    date: "2025-04-05",
    likes: 24,
    comments: 5,
    status: "responded"
  },
  {
    id: "fb-002",
    subject: "Traffic Light Timing",
    message: "The traffic light at the intersection of Oak Street and Main Avenue is poorly timed. During rush hour, cars are backed up for several blocks. Could we get a traffic study to optimize the signal timing?",
    category: "Transportation",
    submittedBy: "Maria Johnson",
    avatar: "/placeholder.svg",
    date: "2025-04-03",
    likes: 45,
    comments: 12,
    status: "responded"
  },
  {
    id: "fb-003",
    subject: "Community Center Hours",
    message: "The community center's reduced hours are making it difficult for working families to access services. Could we consider extending hours at least two evenings per week?",
    category: "Services",
    submittedBy: "James Wilson",
    avatar: "/placeholder.svg",
    date: "2025-04-01",
    likes: 19,
    comments: 8,
    status: "under_review"
  },
  {
    id: "fb-004",
    subject: "Sidewalk Repair Needed",
    message: "The sidewalk on Cedar Avenue between 3rd and 4th Street has several large cracks that pose a tripping hazard, especially for elderly residents in the area. This needs to be addressed before someone gets injured.",
    category: "Infrastructure",
    submittedBy: "Patricia Garcia",
    avatar: "/placeholder.svg",
    date: "2025-03-28",
    likes: 32,
    comments: 7,
    status: "pending"
  },
  {
    id: "fb-005",
    subject: "Street Light Outage",
    message: "Several street lights are out on Maple Street between 5th and 7th Avenue, creating safety concerns at night. This area has a lot of foot traffic from the nearby restaurant district.",
    category: "Safety",
    submittedBy: "Robert Chen",
    avatar: "/placeholder.svg",
    date: "2025-03-25",
    likes: 28,
    comments: 4,
    status: "pending"
  }
];

// Response for feedback with responses
const responseData = {
  "fb-001": {
    content: "Thank you for bringing this to our attention. Our Parks Department has scheduled repairs for the playground equipment for next week. The graffiti has already been removed as of yesterday. We appreciate your concern for our community spaces.",
    respondedBy: "Sarah Johnson",
    role: "Parks Department",
    avatar: "/placeholder.svg",
    date: "2025-04-07"
  },
  "fb-002": {
    content: "We appreciate your feedback on the traffic light timing. The Transportation Department has initiated a traffic study at this intersection, which will be completed within the next two weeks. Based on the results, we'll adjust the signal timing accordingly.",
    respondedBy: "David Williams",
    role: "Transportation Authority",
    avatar: "/placeholder.svg",
    date: "2025-04-06"
  }
};

const categoryColors: Record<string, string> = {
  "Infrastructure": "bg-violet-100 text-violet-800",
  "Maintenance": "bg-red-100 text-red-800",
  "Transportation": "bg-blue-100 text-blue-800",
  "Services": "bg-green-100 text-green-800",
  "Safety": "bg-amber-100 text-amber-800",
  "Environment": "bg-emerald-100 text-emerald-800",
  "Other": "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  "pending": "bg-gray-100 text-gray-800",
  "under_review": "bg-blue-100 text-blue-800",
  "responded": "bg-green-100 text-green-800",
  "closed": "bg-gray-100 text-gray-800",
};

const FeedbackList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          feedback.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || feedback.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-civic-gray-dark">Filter:</span>
          <Tabs defaultValue={filterStatus} value={filterStatus} onValueChange={setFilterStatus}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="responded">Responded</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredFeedback.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle size={48} className="text-civic-gray mb-4" />
              <p className="text-civic-gray-dark">No feedback found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          filteredFeedback.map(feedback => (
            <Card key={feedback.id} className="overflow-hidden">
              <div className="border-l-4 border-civic-blue">
                <CardHeader className="bg-gray-50 py-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge className={categoryColors[feedback.category]}>
                          {feedback.category}
                        </Badge>
                        <Badge className={statusColors[feedback.status]}>
                          {feedback.status === "under_review" ? "Under Review" : 
                           feedback.status === "responded" ? "Responded" : 
                           feedback.status === "closed" ? "Closed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-civic-gray">
                      <Calendar size={14} />
                      <span>{new Date(feedback.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <img src={feedback.avatar} alt={feedback.submittedBy} />
                    </Avatar>
                    <div>
                      <div className="font-medium mb-1">{feedback.submittedBy}</div>
                      <p className="text-civic-gray-dark">{feedback.message}</p>
                    </div>
                  </div>
                  
                  {responseData[feedback.id as keyof typeof responseData] && (
                    <div className="mt-6 ml-14 p-4 bg-gray-50 rounded-md border-l-4 border-green-400">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <img 
                            src={responseData[feedback.id as keyof typeof responseData].avatar} 
                            alt={responseData[feedback.id as keyof typeof responseData].respondedBy} 
                          />
                        </Avatar>
                        <div>
                          <div className="flex flex-wrap gap-2 items-center mb-1">
                            <span className="font-medium">
                              {responseData[feedback.id as keyof typeof responseData].respondedBy}
                            </span>
                            <Badge variant="outline">
                              {responseData[feedback.id as keyof typeof responseData].role}
                            </Badge>
                          </div>
                          <p className="text-civic-gray-dark mb-2">
                            {responseData[feedback.id as keyof typeof responseData].content}
                          </p>
                          <div className="text-xs text-civic-gray">
                            Responded on {new Date(responseData[feedback.id as keyof typeof responseData].date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <div className="border-t px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-civic-gray">
                      <ThumbsUp size={16} />
                      <span>{feedback.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-civic-gray">
                      <MessageCircle size={16} />
                      <span>{feedback.comments}</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
