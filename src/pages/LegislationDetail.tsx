
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { 
  ArrowLeft, ThumbsUp, Calendar, Users, MapPin, 
  FileText, MessageSquare, Send, Download, Mail, Phone, Share2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

// Sample detailed legislation data with Indian context
const legislationDetails = {
  "leg-001": {
    id: "leg-001",
    title: "Green Space Development Plan for Delhi NCR",
    summary: "A proposal to increase public parks and green spaces in Delhi NCR residential neighborhoods by 15% over the next three years.",
    fullText: `# Green Space Development Plan for Delhi NCR

## Executive Summary
This plan aims to increase public parks and green spaces in Delhi NCR residential neighborhoods by 15% over the next three years. Studies have shown that access to green spaces improves mental health, air quality, and community engagement.

## Key Objectives
1. Convert vacant lots into community gardens and pocket parks
2. Expand existing parks where possible
3. Create green corridors connecting major parks
4. Install sustainable landscaping in public areas

## Budget Allocation
- ₹25 crore for land acquisition
- ₹18 crore for park development
- ₹8 crore for maintenance equipment
- ₹5 crore for community engagement and education

## Implementation Timeline
- Year 1: Planning, community input, and initial acquisitions
- Year 2: Major development phase across 5 target neighborhoods
- Year 3: Completion of remaining projects and establishment of maintenance programs`,
    status: "in_review",
    date: "April 5, 2023",
    submissionDate: "March 15, 2023",
    reviewDate: "May 1, 2023",
    category: "Environment",
    neighborhoods: ["South Delhi", "Noida"],
    sponsors: [
      { name: "Rajesh Sharma", role: "Municipal Corporation", avatar: "/placeholder.svg", phone: "+91 98765 43210", email: "rajesh.sharma@delhigov.in" },
      { name: "Priya Patel", role: "Parks Department", avatar: "/placeholder.svg", phone: "+91 98765 12345", email: "priya.patel@delhigov.in" }
    ],
    comments: [
      { 
        id: "c1", 
        user: "Arun Mehta", 
        avatar: "/placeholder.svg", 
        content: "I fully support this initiative. The South Delhi area desperately needs more green spaces for families.", 
        date: "April 10, 2023",
        likes: 12
      },
      { 
        id: "c2", 
        user: "Suman Gupta", 
        avatar: "/placeholder.svg", 
        content: "While I appreciate the intention, I'm concerned about the maintenance budget. Who will ensure these spaces remain clean and safe?", 
        date: "April 8, 2023",
        likes: 8
      },
      { 
        id: "c3", 
        user: "Deepak Singh", 
        avatar: "/placeholder.svg", 
        content: "Could we ensure some of these spaces include community garden areas? It would be great for local food security.", 
        date: "April 6, 2023",
        likes: 15
      }
    ],
    documents: [
      { name: "Environmental Impact Assessment", type: "PDF", size: "2.4 MB", url: "#" },
      { name: "Budget Breakdown", type: "XLSX", size: "1.1 MB", url: "#" },
      { name: "Community Survey Results", type: "PDF", size: "3.7 MB", url: "#" }
    ]
  },
  "leg-002": {
    id: "leg-002",
    title: "Metro Rail Expansion Project",
    summary: "Extension of metro routes to underserved neighborhoods in Mumbai and increased frequency during peak hours.",
    fullText: `# Mumbai Metro Rail Expansion Plan

## Executive Summary
This plan proposes to extend metro routes to currently underserved neighborhoods in Mumbai and increase service frequency during peak hours. The goal is to improve transit accessibility for all residents and reduce traffic congestion.

## Key Objectives
1. Add 5 new metro routes to connect underserved areas
2. Increase frequency on existing high-demand routes
3. Extend service hours on weekends
4. Upgrade stations with modern amenities and real-time arrival information

## Budget Allocation
- ₹320 crore for new metro coaches
- ₹150 crore for infrastructure improvements
- ₹210 crore for operational costs
- ₹40 crore for technology upgrades

## Implementation Timeline
- Phase 1 (3 months): Route planning and community feedback
- Phase 2 (6 months): Infrastructure upgrades and driver hiring
- Phase 3 (3 months): New route rollout and service adjustments`,
    status: "proposed",
    date: "April 2, 2023",
    submissionDate: "March 10, 2023",
    reviewDate: "April 25, 2023",
    category: "Transportation",
    neighborhoods: ["Andheri", "Bandra", "Dadar"],
    sponsors: [
      { name: "Vikram Desai", role: "Mumbai Metro Rail Corporation", avatar: "/placeholder.svg", phone: "+91 77889 12345", email: "vikram.desai@mmrc.in" },
      { name: "Sunita Sharma", role: "Municipal Corporation", avatar: "/placeholder.svg", phone: "+91 98765 54321", email: "sunita.sharma@mcgm.gov.in" }
    ],
    comments: [
      { 
        id: "c1", 
        user: "Amit Patil", 
        avatar: "/placeholder.svg", 
        content: "This is long overdue. Andheri has had inadequate public transit for years.", 
        date: "April 4, 2023",
        likes: 23
      },
      { 
        id: "c2", 
        user: "Neha Joshi", 
        avatar: "/placeholder.svg", 
        content: "Will the new metro trains be electric? I hope we're thinking about environmental impact.", 
        date: "April 3, 2023",
        likes: 17
      }
    ],
    documents: [
      { name: "Route Maps", type: "PDF", size: "5.2 MB", url: "#" },
      { name: "Economic Impact Study", type: "PDF", size: "3.3 MB", url: "#" },
      { name: "Transit Survey Data", type: "XLSX", size: "1.8 MB", url: "#" }
    ]
  },
  // More legislation details for other IDs
  "leg-003": {
    id: "leg-003",
    title: "Affordable Housing Initiative for Bengaluru",
    summary: "Plan to develop 200 affordable housing units in partnership with local developers in Bengaluru, with rent control measures for 10 years.",
    status: "proposed",
    date: "March 28, 2023",
    submissionDate: "March 5, 2023",
    reviewDate: "April 20, 2023",
    category: "Housing",
    neighborhoods: ["Whitefield", "Electronic City"],
    sponsors: [
      { name: "Venkatesh Rao", role: "Housing Department", avatar: "/placeholder.svg", phone: "+91 99988 77766", email: "venkatesh.rao@bengaluru.gov.in" },
      { name: "Lakshmi Nair", role: "Urban Development", avatar: "/placeholder.svg", phone: "+91 88877 66655", email: "lakshmi.nair@karnataka.gov.in" }
    ],
    documents: [
      { name: "Housing Project Plans", type: "PDF", size: "4.7 MB", url: "#" },
      { name: "Budget Allocation", type: "XLSX", size: "1.5 MB", url: "#" }
    ],
    fullText: "Full text for affordable housing initiative...",
    comments: []
  },
  "leg-004": {
    id: "leg-004",
    title: "MSME Grant Program",
    summary: "Creation of a ₹20 crore fund to provide grants to small businesses affected by recent economic challenges in Chennai.",
    status: "passed",
    date: "March 20, 2023",
    submissionDate: "February 25, 2023",
    reviewDate: "March 15, 2023",
    category: "Economic Development",
    neighborhoods: ["T. Nagar", "Mylapore", "Anna Nagar"],
    sponsors: [
      { name: "Karthik Subramanian", role: "Economic Development Office", avatar: "/placeholder.svg", phone: "+91 77777 88888", email: "karthik.s@chennai.gov.in" },
      { name: "Meena Ravi", role: "MSME Department", avatar: "/placeholder.svg", phone: "+91 99900 11122", email: "meena.ravi@tn.gov.in" }
    ],
    documents: [
      { name: "Grant Guidelines", type: "PDF", size: "2.1 MB", url: "#" },
      { name: "Application Form", type: "PDF", size: "1.0 MB", url: "#" }
    ],
    fullText: "Full text for MSME grant program...",
    comments: []
  },
  "leg-005": {
    id: "leg-005",
    title: "Road Infrastructure Improvement in Hyderabad",
    summary: "Comprehensive plan to repair roads, bridges and footpaths across Hyderabad over the next fiscal year.",
    status: "in_review",
    date: "March 15, 2023",
    submissionDate: "February 20, 2023",
    reviewDate: "April 10, 2023",
    category: "Infrastructure",
    neighborhoods: ["Citywide"],
    sponsors: [
      { name: "Suresh Reddy", role: "Roads & Buildings Department", avatar: "/placeholder.svg", phone: "+91 88899 00011", email: "suresh.reddy@hyderabad.gov.in" },
      { name: "Fatima Khan", role: "Urban Planning", avatar: "/placeholder.svg", phone: "+91 77766 55544", email: "fatima.khan@telangana.gov.in" }
    ],
    documents: [
      { name: "Infrastructure Assessment", type: "PDF", size: "6.3 MB", url: "#" },
      { name: "Project Timeline", type: "PDF", size: "1.2 MB", url: "#" }
    ],
    fullText: "Full text for road infrastructure improvement...",
    comments: []
  },
  "leg-006": {
    id: "leg-006",
    title: "Mid-day Meal Program Enhancement",
    summary: "Expansion of the mid-day meal program to provide nutritious breakfast and lunch options to all public school students in Kolkata.",
    status: "passed",
    date: "March 10, 2023",
    submissionDate: "February 10, 2023",
    reviewDate: "March 5, 2023",
    category: "Education",
    neighborhoods: ["Citywide"],
    sponsors: [
      { name: "Debashish Bose", role: "Education Department", avatar: "/placeholder.svg", phone: "+91 99988 77744", email: "debashish.bose@wb.gov.in" },
      { name: "Rupa Chatterjee", role: "School Board", avatar: "/placeholder.svg", phone: "+91 88877 66633", email: "rupa.c@kolkata.gov.in" }
    ],
    documents: [
      { name: "Nutrition Guidelines", type: "PDF", size: "3.2 MB", url: "#" },
      { name: "Implementation Plan", type: "PDF", size: "2.5 MB", url: "#" }
    ],
    fullText: "Full text for mid-day meal program enhancement...",
    comments: []
  }
};

const LegislationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [documentToDownload, setDocumentToDownload] = useState<any>(null);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });
  
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

  // Handle contact form submission
  const handleContactSubmit = (data: any) => {
    console.log("Contact form submitted:", data);
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the representative.",
    });
    setIsContactDialogOpen(false);
    form.reset();
  };

  // Handle sponsor contact
  const handleSponsorContact = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setIsSponsorDialogOpen(true);
  };

  // Handle support legislation
  const handleSupportLegislation = () => {
    if (!hasSupported) {
      setSupportCount(prevCount => prevCount + 1);
      setHasSupported(true);
      toast({
        title: "Support Recorded",
        description: "Thank you for supporting this legislation.",
      });
    } else {
      toast({
        title: "Already Supported",
        description: "You have already supported this legislation.",
      });
    }
  };

  // Handle document download
  const handleDownloadDocument = (doc: any) => {
    setDocumentToDownload(doc);
    setIsDownloadDialogOpen(true);
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: `${doc.name} (${doc.size}) is downloading.`,
      });
      setIsDownloadDialogOpen(false);
    }, 1500);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: legislation?.title,
        text: legislation?.summary,
        url: window.location.href,
      }).then(() => {
        console.log("Shared successfully");
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Legislation link copied to clipboard.",
      });
    }
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadDocument(doc)}
                              >
                                <Download size={14} className="mr-1" /> Download
                              </Button>
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
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsSponsorDialogOpen(true)}
                  >
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
                  <Button 
                    className="w-full bg-civic-blue hover:bg-civic-blue-dark" 
                    onClick={handleSupportLegislation}
                    disabled={hasSupported}
                  >
                    <ThumbsUp size={16} className="mr-2" />
                    {hasSupported ? `Supported (${supportCount})` : 'Support This Legislation'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => legislation.documents.length > 0 && handleDownloadDocument(legislation.documents[0])}
                  >
                    <FileText size={16} className="mr-2" />
                    Download Full Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Contact Representative
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleShare}
                  >
                    <Share2 size={16} className="mr-2" />
                    Share Legislation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Representative Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Representative</DialogTitle>
            <DialogDescription>
              Send a message to the representative regarding this legislation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleContactSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name"
                  {...form.register("name", { required: true })}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">Name is required</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Your Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  {...form.register("email", { required: true })}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">Email is required</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here"
                  className="min-h-[100px]"
                  {...form.register("message", { required: true })}
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500">Message is required</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Sponsor Dialog */}
      <Dialog open={isSponsorDialogOpen} onOpenChange={setIsSponsorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Sponsors</DialogTitle>
            <DialogDescription>
              Reach out to the sponsors of this legislation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-medium mb-4">Choose a sponsor to contact:</h4>
            <div className="space-y-4">
              {legislation.sponsors.map((sponsor, index) => (
                <div key={index} className="flex flex-col p-3 border rounded-md">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <img src={sponsor.avatar} alt={sponsor.name} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <p className="text-sm text-civic-gray">{sponsor.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = `tel:${sponsor.phone}`}>
                      <Phone size={14} className="mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = `mailto:${sponsor.email}`}>
                      <Mail size={14} className="mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSponsorDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Document Dialog */}
      <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Downloading Document</DialogTitle>
            <DialogDescription>
              {documentToDownload?.name} ({documentToDownload?.size})
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center">
            <Download size={48} className="text-civic-blue animate-pulse mb-4" />
            <p>Preparing download...</p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default LegislationDetail;
