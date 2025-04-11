import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, ArrowLeft, ThumbsUp, MessageSquare, Calendar, Clock, 
  User, MapPin, Download, Share2, Copy, Mail, Phone, Globe,
  ThumbsDown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

const LegislationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [legislation, setLegislation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState<"support" | "oppose" | null>(null);
  const shareUrlRef = useRef<HTMLInputElement>(null);
  
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', value);
    window.history.pushState({}, '', newUrl);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setTimeout(() => {
      setLegislation({
        id: id,
        title: "Public Transportation Funding Initiative for Delhi Metro",
        status: "Active",
        category: "Transportation",
        submittedBy: "Transportation Committee",
        submitterContact: {
          email: "transport.committee@delhi.gov.in",
          phone: "+91-11-2345-6789",
          website: "https://delhimetro.gov.in/initiatives"
        },
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
            avatar: "RS",
            date: "2025-03-27",
            content: "This is a much-needed initiative. The eastern suburbs have been neglected for too long when it comes to metro connectivity.",
            upvotes: 24,
            replies: [
              {
                id: "r1-c1",
                user: "Meera Singh",
                avatar: "MS",
                date: "2025-03-27",
                content: "Absolutely! I commute from the eastern part of the city and the lack of connectivity adds at least 45 minutes to my journey each way.",
                upvotes: 8
              }
            ]
          },
          {
            id: "c2",
            user: "Priya Patel",
            avatar: "PP",
            date: "2025-03-26",
            content: "I support the idea but I'm concerned about the increased ticket prices that might come as a result of this expansion.",
            upvotes: 18,
            replies: []
          },
          {
            id: "c3",
            user: "Amit Kumar",
            avatar: "AK",
            date: "2025-03-25",
            content: "Will this initiative also address the last-mile connectivity issues? Many people still struggle to reach the metro stations from their homes.",
            upvotes: 31,
            replies: [
              {
                id: "r1-c3",
                user: "Transportation Committee",
                avatar: "TC",
                date: "2025-03-26",
                content: "Thank you for your question. Phase 2 of this initiative will include provisions for electric feeder buses and e-rickshaw stands at all new stations.",
                upvotes: 14
              }
            ]
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (!loading && legislation && tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [loading, legislation, tabFromUrl]);

  const handleVote = (vote: "support" | "oppose") => {
    if (!legislation) return;
    
    if (hasVoted) {
      toast({
        title: "Vote Already Cast",
        description: `You have already voted ${hasVoted}. You cannot change or cast another vote.`,
        variant: "destructive"
      });
      return;
    }
    
    setLegislation(prev => {
      if (vote === "support") {
        return {
          ...prev,
          supportVotes: prev.supportVotes + 1,
          totalVotes: prev.totalVotes + 1
        };
      } else {
        return {
          ...prev,
          opposeVotes: prev.opposeVotes + 1,
          totalVotes: prev.totalVotes + 1
        };
      }
    });
    
    setHasVoted(vote);
    
    toast({
      title: "Vote Recorded",
      description: `Your ${vote} vote has been recorded. Thank you for participating!`,
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !legislation) return;
    
    const newComment = {
      id: `c${legislation.comments.length + 1}`,
      user: "Current User",
      avatar: "CU",
      date: new Date().toISOString().split('T')[0],
      content: commentText,
      upvotes: 0,
      replies: []
    };
    
    setLegislation(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
    
    toast({
      title: "Comment Posted",
      description: "Your comment has been added to the discussion.",
    });
    
    setCommentText("");
  };

  const handleUpvoteComment = (commentId: string) => {
    if (!legislation) return;
    
    setLegislation(prev => ({
      ...prev,
      comments: prev.comments.map((comment: any) => 
        comment.id === commentId 
          ? { ...comment, upvotes: comment.upvotes + 1 } 
          : comment
      )
    }));
    
    toast({
      title: "Upvoted Comment",
      description: "Your vote has been recorded.",
      variant: "default",
    });
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyText.trim() || !legislation) return;
    
    const newReply = {
      id: `r${Date.now()}`,
      user: "Current User",
      avatar: "CU",
      date: new Date().toISOString().split('T')[0],
      content: replyText,
      upvotes: 0
    };
    
    setLegislation(prev => ({
      ...prev,
      comments: prev.comments.map((comment: any) => 
        comment.id === commentId 
          ? { 
              ...comment, 
              replies: [...comment.replies, newReply] 
            }
          : comment
      )
    }));
    
    toast({
      title: "Reply Posted",
      description: "Your reply has been added to the discussion.",
    });
    
    setReplyText("");
    setReplyingTo(null);
  };

  const handleUpvoteReply = (commentId: string, replyId: string) => {
    if (!legislation) return;
    
    setLegislation(prev => ({
      ...prev,
      comments: prev.comments.map((comment: any) => 
        comment.id === commentId 
          ? { 
              ...comment, 
              replies: comment.replies.map((reply: any) => 
                reply.id === replyId 
                  ? { ...reply, upvotes: reply.upvotes + 1 } 
                  : reply
              )
            }
          : comment
      )
    }));
    
    toast({
      title: "Upvoted Reply",
      description: "Your vote has been recorded.",
      variant: "default",
    });
  };

  const handleCopyShareUrl = () => {
    if (shareUrlRef.current) {
      shareUrlRef.current.select();
      navigator.clipboard.writeText(shareUrlRef.current.value);
      toast({
        title: "Link Copied",
        description: "The legislation URL has been copied to your clipboard.",
      });
    }
  };

  const handleShareVia = (platform: string) => {
    const shareUrl = window.location.href;
    const shareTitle = legislation?.title || "Legislation";
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent("Check out this legislation: " + shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
      setIsShareDialogOpen(false);
    }
  };

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

  const supportPercentage = Math.round((legislation.supportVotes / legislation.totalVotes) * 100);

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
          <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
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
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => handleTabChange("documents")}
                >
                  View Documents
                </Button>
                <Button 
                  onClick={() => handleTabChange("discussion")}
                >
                  Join Discussion
                </Button>
              </div>
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
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded mr-3">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{document.name}</h4>
                            <p className="text-xs text-muted-foreground">{document.size}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Download Started",
                              description: `Downloading ${document.name}...`,
                            });
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => handleTabChange("overview")}
                    >
                      Back to Overview
                    </Button>
                    <Button 
                      onClick={() => handleTabChange("discussion")}
                    >
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussion" className="space-y-6 pt-4" id="discussion-section">
              <Card>
                <CardHeader>
                  <CardTitle>Public Comments</CardTitle>
                  <CardDescription>Join the discussion on this legislation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                      <div>
                        <Textarea
                          placeholder="Add your comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full min-h-[100px]"
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
                        <div key={comment.id} className="py-5 border-b last:border-b-0">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{comment.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <div className="font-medium">{comment.user}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(comment.date).toLocaleDateString()}
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-2">{comment.content}</p>
                              <div className="flex items-center text-xs text-muted-foreground mb-3">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleUpvoteComment(comment.id)}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  {comment.upvotes}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setReplyingTo(comment.id)}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                              </div>
                              
                              {replyingTo === comment.id && (
                                <div className="mb-4 pl-4 border-l-2">
                                  <Textarea
                                    placeholder="Write your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full min-h-[80px] mb-2"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setReplyingTo(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => handleSubmitReply(comment.id)}
                                      disabled={!replyText.trim()}
                                    >
                                      Post Reply
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="pl-4 border-l-2 space-y-3 mt-3">
                                  {comment.replies.map((reply: any) => (
                                    <div key={reply.id} className="pt-3">
                                      <div className="flex items-start gap-3">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback>{reply.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex justify-between mb-1">
                                            <div className="font-medium text-sm">{reply.user}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {new Date(reply.date).toLocaleDateString()}
                                            </div>
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-5 px-2 text-xs"
                                            onClick={() => handleUpvoteReply(comment.id, reply.id)}
                                          >
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            {reply.upvotes}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
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
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${supportPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {legislation.totalVotes} total votes
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    variant={hasVoted === "support" ? "default" : "outline"}
                    className={hasVoted === "support" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-green-50 hover:bg-green-100 border-green-200"}
                    onClick={() => handleVote("support")}
                    disabled={hasVoted !== null}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                    Support
                  </Button>
                  <Button 
                    variant={hasVoted === "oppose" ? "default" : "outline"}
                    className={hasVoted === "oppose" 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-red-50 hover:bg-red-100 border-red-200"}
                    onClick={() => handleVote("oppose")}
                    disabled={hasVoted !== null}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                    Oppose
                  </Button>
                </div>
                {hasVoted && (
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    You have voted {hasVoted} on this legislation.
                  </div>
                )}
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
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Proposer
                </Button>
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Legislation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this Legislation</DialogTitle>
            <DialogDescription>
              Share this legislation with others through various platforms
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Input
                ref={shareUrlRef}
                defaultValue={window.location.href}
                readOnly
                className="w-full"
              />
            </div>
            <Button 
              type="button" 
              size="sm" 
              className="px-3" 
              onClick={handleCopyShareUrl}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4 py-4`}>
            <Button 
              variant="outline"
              className="bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 text-[#1da1f2]"
              onClick={() => handleShareVia('twitter')}
            >
              Share on Twitter
            </Button>
            <Button 
              variant="outline"
              className="bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2]"
              onClick={() => handleShareVia('facebook')}
            >
              Share on Facebook
            </Button>
            <Button 
              variant="outline"
              className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]"
              onClick={() => handleShareVia('whatsapp')}
            >
              Share on WhatsApp
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleShareVia('email')}
            >
              Share via Email
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {legislation.submittedBy}</DialogTitle>
            <DialogDescription>
              Get in touch with the proposers of this legislation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-md border">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm">Email</div>
                <a 
                  href={`mailto:${legislation.submitterContact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {legislation.submitterContact.email}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-md border">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm">Phone</div>
                <a 
                  href={`tel:${legislation.submitterContact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {legislation.submitterContact.phone}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-md border">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm">Website</div>
                <a 
                  href={legislation.submitterContact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {legislation.submitterContact.website.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsContactDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegislationDetail;
