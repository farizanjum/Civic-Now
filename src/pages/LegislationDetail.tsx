
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ArrowLeft, ThumbsUp, MessageSquare, Calendar, Clock, User, MapPin, Download, Share2 } from "lucide-react";

const LegislationDetail = () => {
  const { id } = useParams();
  const [legislation, setLegislation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [commentText, setCommentText] = useState("");

  // Mock legislation data
  useEffect(() => {
    // In a real app, this would be an API call using the ID from the URL
    setTimeout(() => {
      setLegislation({
        id: id,
        title: "Public Transportation Funding Initiative for Delhi Metro",
        status: "Active",
        category: "Transportation",
        submittedBy: "Transportation Committee",
        dateSubmitted: "2025-02-20",
        lastUpdated: "2025-03-25",
        voteDeadline: "2025-06-30",
        totalVotes: 1245,
        supportVotes: 982,
        opposeVotes: 263,
        description: "This legislation proposes an increase in funding for the Delhi Metro system to expand services to underserved areas and improve frequency of trains during peak hours. The initiative aims to reduce traffic congestion, decrease commute times, and provide more sustainable transportation options for city residents.",
        keyPoints: [
          "Allocate ₹500 crore for the expansion of metro lines to eastern suburbs",
          "Increase train frequency during peak hours from every 5 minutes to every 3 minutes",
          "Fund the purchase of 50 new train sets to improve capacity",
          "Implement integrated ticketing with bus services for seamless transfers",
          "Create dedicated infrastructure funds for ongoing maintenance and upgrades"
        ],
        affectedAreas: ["Delhi NCR", "Gurgaon", "Noida", "Ghaziabad", "Faridabad"],
        documents: [
          { name: "Full Legislation Text", type: "pdf", size: "2.4 MB" },
          { name: "Budget Breakdown", type: "xlsx", size: "1.1 MB" },
          { name: "Impact Assessment", type: "pdf", size: "3.7 MB" }
        ],
        comments: [
          {
            id: "c1",
            user: "Rahul Sharma",
            date: "2025-03-27",
            content: "This is a much-needed initiative. The eastern suburbs have been neglected for too long when it comes to metro connectivity.",
            upvotes: 24
          },
          {
            id: "c2",
            user: "Priya Patel",
            date: "2025-03-26",
            content: "I support the idea but I'm concerned about the increased ticket prices that might come as a result of this expansion.",
            upvotes: 18
          },
          {
            id: "c3",
            user: "Amit Kumar",
            date: "2025-03-25",
            content: "Will this initiative also address the last-mile connectivity issues? Many people still struggle to reach the metro stations from their homes.",
            upvotes: 31
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-xl">Loading legislation details...</h2>
        </div>
      </div>
    );
  }

  if (!legislation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-xl text-red-600">Legislation not found</h2>
          <Link to="/legislation" className="text-blue-600 hover:underline mt-4 inline-block">
            Go back to legislation list
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // In a real application, this would submit to an API
    console.log("Submitting comment:", commentText);
    
    // Clear comment field
    setCommentText("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/legislation" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Legislation
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{legislation.title}</h1>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getStatusColor(legislation.status)}>{legislation.status}</Badge>
          <Badge variant="outline">{legislation.category}</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {legislation.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {legislation.keyPoints.map((point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Affected Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {legislation.affectedAreas.map((area: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>View and download related documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {legislation.documents.map((document: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded mr-3">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{document.name}</h4>
                            <p className="text-xs text-muted-foreground">{document.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussion" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Public Comments</CardTitle>
                  <CardDescription>Join the discussion on this legislation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Comment input */}
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                      <div>
                        <Input
                          placeholder="Add your comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={!commentText.trim()}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </form>
                    
                    <div className="border-t pt-4 mt-4">
                      {legislation.comments.map((comment: any) => (
                        <div key={comment.id} className="py-4 border-b last:border-b-0">
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{comment.user}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(comment.date).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-2">{comment.content}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.upvotes}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vote on this Legislation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Support:</span>
                  <span className="font-medium text-green-600">{legislation.supportVotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Oppose:</span>
                  <span className="font-medium text-red-600">{legislation.opposeVotes}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(legislation.supportVotes / legislation.totalVotes) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {legislation.totalVotes} total votes
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                    Support
                  </Button>
                  <Button variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200">
                    <ThumbsUp className="h-4 w-4 mr-2 text-red-600 rotate-180" />
                    Oppose
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Submitted by</div>
                    <div className="text-sm text-muted-foreground">{legislation.submittedBy}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Submitted on</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(legislation.dateSubmitted).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Voting deadline</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(legislation.voteDeadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Share</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  readOnly
                  value={window.location.href}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Legislation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegislationDetail;
