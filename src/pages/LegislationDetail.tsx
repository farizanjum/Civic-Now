
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, ThumbsUp, Calendar, Users, MapPin, FileText, MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample detailed legislation data
const legislationDetails = {
  "leg-001": {
    id: "leg-001",
    title: "Green Space Development Plan",
    summary: "A proposal to increase public parks and green spaces in residential neighborhoods by 15% over the next three years.",
    fullText: `# Green Space Development Plan

## Executive Summary
This plan aims to increase public parks and green spaces in residential neighborhoods by 15% over the next three years. Studies have shown that access to green spaces improves mental health, air quality, and community engagement.

## Key Objectives
1. Convert vacant lots into community gardens and pocket parks
2. Expand existing parks where possible
3. Create green corridors connecting major parks
4. Install sustainable landscaping in public areas

## Budget Allocation
- $2.5M for land acquisition
- $1.8M for park development
- $800K for maintenance equipment
- $500K for community engagement and education

## Implementation Timeline
- Year 1: Planning, community input, and initial acquisitions
- Year 2: Major development phase across 5 target neighborhoods
- Year 3: Completion of remaining projects and establishment of maintenance programs`,
    status: "in_review",
    date: "April 5, 2023",
    submissionDate: "March 15, 2023",
    reviewDate: "May 1, 2023",
    category: "Environment",
    neighborhoods: ["Downtown", "Riverside"],
    sponsors: [
      { name: "Jane Smith", role: "City Council", avatar: "/placeholder.svg" },
      { name: "Michael Johnson", role: "Parks Department", avatar: "/placeholder.svg" }
    ],
    comments: [
      { 
        id: "c1", 
        user: "Alex Rivera", 
        avatar: "/placeholder.svg", 
        content: "I fully support this initiative. The Riverside area desperately needs more green spaces for families.", 
        date: "April 10, 2023",
        likes: 12
      },
      { 
        id: "c2", 
        user: "Sarah Chen", 
        avatar: "/placeholder.svg", 
        content: "While I appreciate the intention, I'm concerned about the maintenance budget. Who will ensure these spaces remain clean and safe?", 
        date: "April 8, 2023",
        likes: 8
      },
      { 
        id: "c3", 
        user: "Marcus Dupont", 
        avatar: "/placeholder.svg", 
        content: "Could we ensure some of these spaces include community garden areas? It would be great for local food security.", 
        date: "April 6, 2023",
        likes: 15
      }
    ],
    documents: [
      { name: "Environmental Impact Assessment", type: "PDF", size: "2.4 MB" },
      { name: "Budget Breakdown", type: "XLSX", size: "1.1 MB" },
      { name: "Community Survey Results", type: "PDF", size: "3.7 MB" }
    ]
  },
  "leg-002": {
    id: "leg-002",
    title: "Public Transit Expansion",
    summary: "Extension of bus routes to underserved neighborhoods and increased frequency during peak hours.",
    fullText: `# Public Transit Expansion Plan

## Executive Summary
This plan proposes to extend bus routes to currently underserved neighborhoods and increase service frequency during peak hours. The goal is to improve transit accessibility for all residents and reduce traffic congestion.

## Key Objectives
1. Add 5 new bus routes to connect underserved areas
2. Increase frequency on existing high-demand routes
3. Extend service hours on weekends
4. Upgrade bus stops with shelters and real-time arrival information

## Budget Allocation
- $3.2M for new buses
- $1.5M for infrastructure improvements
- $2.1M for operational costs
- $400K for technology upgrades

## Implementation Timeline
- Phase 1 (3 months): Route planning and community feedback
- Phase 2 (6 months): Infrastructure upgrades and driver hiring
- Phase 3 (3 months): New route rollout and service adjustments`,
    status: "proposed",
    date: "April 2, 2023",
    submissionDate: "March 10, 2023",
    reviewDate: "April 25, 2023",
    category: "Transportation",
    neighborhoods: ["Northside", "Westend", "Downtown"],
    sponsors: [
      { name: "Robert Chen", role: "Transit Authority", avatar: "/placeholder.svg" },
      { name: "Maria Rodriguez", role: "City Council", avatar: "/placeholder.svg" }
    ],
    comments: [
      { 
        id: "c1", 
        user: "James Wilson", 
        avatar: "/placeholder.svg", 
        content: "This is long overdue. The Northside has had inadequate public transit for years.", 
        date: "April 4, 2023",
        likes: 23
      },
      { 
        id: "c2", 
        user: "Emma Johnson", 
        avatar: "/placeholder.svg", 
        content: "Will the new buses be electric or hybrid? I hope we're thinking about environmental impact.", 
        date: "April 3, 2023",
        likes: 17
      }
    ],
    documents: [
      { name: "Route Maps", type: "PDF", size: "5.2 MB" },
      { name: "Economic Impact Study", type: "PDF", size: "3.3 MB" },
      { name: "Transit Survey Data", type: "XLSX", size: "1.8 MB" }
    ]
  },
  // More legislation details would be added here for other IDs
};

const LegislationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  
  // Get legislation details
  const legislation = legislationDetails[id as keyof typeof legislationDetails];
  
  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment Submitted",
      description: "Your comment has been submitted for review.",
    });
    setComment("");
  };

  // Go back to legislation list
  const handleBackClick = () => {
    navigate("/legislation");
  };
  
  if (!legislation) {
    return (
      <Layout>
        <div className="civic-container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Legislation not found</h2>
          <p className="mb-6">The legislation you are looking for may have been removed or does not exist.</p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Legislation
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-civic-blue/10 py-10">
        <div className="civic-container">
          <Button variant="outline" onClick={handleBackClick} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Legislation
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Legislation Header */}
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={`
                      ${legislation.status === "proposed" ? "bg-amber-100 text-amber-800 border-amber-200" : 
                        legislation.status === "in_review" ? "bg-blue-100 text-blue-800 border-blue-200" : 
                        legislation.status === "passed" ? "bg-green-100 text-green-800 border-green-200" : 
                        "bg-red-100 text-red-800 border-red-200"}
                      capitalize
                    `}>
                      {legislation.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary">{legislation.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">{legislation.title}</CardTitle>
                  <CardDescription className="text-base mt-2">{legislation.summary}</CardDescription>
                </CardHeader>
              </Card>
              
              {/* Legislation Details */}
              <Card>
                <CardHeader className="border-b">
                  <h3 className="text-lg font-medium">Legislation Details</h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="fullText">Full Text</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="pt-4">
                      <p className="text-civic-gray-dark">{legislation.summary}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                          <h4 className="text-sm font-medium text-civic-gray mb-2">Submission Date</h4>
                          <p className="flex items-center">
                            <Calendar size={16} className="mr-2 text-civic-blue" />
                            {legislation.submissionDate}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-civic-gray mb-2">Review Date</h4>
                          <p className="flex items-center">
                            <Calendar size={16} className="mr-2 text-civic-blue" />
                            {legislation.reviewDate}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-civic-gray mb-2">Category</h4>
                          <p className="flex items-center">
                            <FileText size={16} className="mr-2 text-civic-blue" />
                            {legislation.category}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-civic-gray mb-2">Affected Areas</h4>
                          <p className="flex items-center">
                            <MapPin size={16} className="mr-2 text-civic-blue" />
                            {legislation.neighborhoods.join(', ')}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="fullText" className="pt-4">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">{legislation.fullText}</pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="documents" className="pt-4">
                      <ul className="divide-y">
                        {legislation.documents.map((doc, index) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <FileText size={16} className="mr-2 text-civic-blue" />
                              <span>{doc.name}</span>
                              <Badge variant="outline" className="ml-2">{doc.type}</Badge>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-civic-gray mr-4">{doc.size}</span>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Comments Section */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Public Feedback</h3>
                    <Badge variant="outline" className="flex items-center">
                      <MessageSquare size={14} className="mr-1" />
                      {legislation.comments.length} Comments
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {legislation.comments.map((comment) => (
                      <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-4">
                            <img src={comment.avatar} alt={comment.user} />
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{comment.user}</h4>
                              <span className="text-sm text-civic-gray">{comment.date}</span>
                            </div>
                            <p className="text-civic-gray-dark">{comment.content}</p>
                            <div className="flex items-center mt-3">
                              <Button variant="ghost" size="sm" className="text-civic-gray hover:text-civic-blue flex items-center">
                                <ThumbsUp size={14} className="mr-1" />
                                {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-civic-gray hover:text-civic-blue">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-col">
                  <h4 className="text-sm font-medium mb-2 w-full">Add Your Comment</h4>
                  <div className="w-full space-y-3">
                    <Textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      placeholder="Share your thoughts on this legislation..."
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                        <Send size={16} className="mr-2" />
                        Submit Comment
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sponsors Card */}
              <Card>
                <CardHeader className="border-b">
                  <h3 className="text-lg font-medium">Legislation Sponsors</h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {legislation.sponsors.map((sponsor, index) => (
                      <div key={index} className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <img src={sponsor.avatar} alt={sponsor.name} />
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{sponsor.name}</h4>
                          <p className="text-sm text-civic-gray">{sponsor.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <Button variant="outline" className="w-full">
                    <Users size={16} className="mr-2" />
                    Contact Sponsors
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Actions Card */}
              <Card>
                <CardHeader className="border-b">
                  <h3 className="text-lg font-medium">Take Action</h3>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <Button className="w-full bg-civic-blue hover:bg-civic-blue-dark">
                    <ThumbsUp size={16} className="mr-2" />
                    Support This Legislation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText size={16} className="mr-2" />
                    Download Full Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare size={16} className="mr-2" />
                    Contact Representative
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LegislationDetail;
