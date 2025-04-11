
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Minus, Users, Check, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/MainLayout";

type VoteOption = {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  voters: Voter[];
};

type Poll = {
  id: string;
  title: string;
  description: string;
  status: "active" | "ended" | "upcoming";
  startDate: string;
  endDate: string;
  totalVotes: number;
  options: VoteOption[];
  hasVoted: boolean;
  userVote?: string;
};

type Initiative = {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdDate: string;
  supporters: number;
  opposers: number;
  neutral: number;
  userSupport?: "support" | "oppose" | "neutral" | null;
  totalResponses: number;
  supportPercentage: number;
  opposePercentage: number;
  neutralPercentage: number;
  voters: Voter[];
};

type Voter = {
  id: string;
  name: string;
  avatar: string;
  vote: string;
};

// Mock voters data
const mockVoters: Voter[] = [
  { id: "v1", name: "Alex Johnson", avatar: "/placeholder.svg", vote: "Option 1" },
  { id: "v2", name: "Sarah Williams", avatar: "/placeholder.svg", vote: "Option 2" },
  { id: "v3", name: "Michael Brown", avatar: "/placeholder.svg", vote: "Option 1" },
  { id: "v4", name: "Emily Davis", avatar: "/placeholder.svg", vote: "Option 3" },
  { id: "v5", name: "David Wilson", avatar: "/placeholder.svg", vote: "Option 1" },
  { id: "v6", name: "Jessica Miller", avatar: "/placeholder.svg", vote: "Option 2" },
  { id: "v7", name: "James Taylor", avatar: "/placeholder.svg", vote: "Option 3" },
  { id: "v8", name: "Linda Martinez", avatar: "/placeholder.svg", vote: "Option 1" },
  { id: "v9", name: "Robert Garcia", avatar: "/placeholder.svg", vote: "Option 2" },
  { id: "v10", name: "Patricia Lee", avatar: "/placeholder.svg", vote: "Option 1" },
];

// Function to distribute voters among options
const distributeVoters = (options: VoteOption[], totalVoters: Voter[]): VoteOption[] => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  
  return options.map(option => {
    // Calculate how many voters should be assigned to this option
    const voterCount = Math.round((option.votes / totalVotes) * totalVoters.length);
    // Assign voters randomly
    const optionVoters = totalVoters
      .slice(0, voterCount)
      .map(voter => ({...voter, vote: option.text}));
    
    // Remove assigned voters from the pool
    totalVoters = totalVoters.slice(voterCount);
    
    return {...option, voters: optionVoters};
  });
};

const Voting = () => {
  // States
  const [activeTab, setActiveTab] = useState<"polls" | "initiatives">("polls");
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isVotersDialogOpen, setIsVotersDialogOpen] = useState(false);
  const [viewingVoters, setViewingVoters] = useState<{id: string, title: string, voters: Voter[]}>({
    id: "",
    title: "",
    voters: []
  });
  
  // Initialize mock data
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "poll1",
      title: "Community Center Improvements",
      description: "Vote on which improvement should be prioritized for our community center.",
      status: "active",
      startDate: "2025-03-01",
      endDate: "2025-04-20",
      totalVotes: 352,
      options: [
        { id: "opt1", text: "Renovate existing facility", votes: 157, percentage: 44.6, voters: [] },
        { id: "opt2", text: "Build new sports courts", votes: 113, percentage: 32.1, voters: [] },
        { id: "opt3", text: "Upgrade technology and equipment", votes: 82, percentage: 23.3, voters: [] }
      ],
      hasVoted: false
    },
    {
      id: "poll2",
      title: "Park Amenities Selection",
      description: "Help us decide which amenities to add to Central Park in the upcoming renovation.",
      status: "active",
      startDate: "2025-03-10",
      endDate: "2025-04-15",
      totalVotes: 278,
      options: [
        { id: "opt1", text: "Playground equipment", votes: 98, percentage: 35.3, voters: [] },
        { id: "opt2", text: "Walking/jogging trails", votes: 124, percentage: 44.6, voters: [] },
        { id: "opt3", text: "Picnic areas", votes: 56, percentage: 20.1, voters: [] }
      ],
      hasVoted: false
    },
    {
      id: "poll3",
      title: "Transportation Budget Allocation",
      description: "Where should the city focus transportation funding for the next fiscal year?",
      status: "ended",
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      totalVotes: 412,
      options: [
        { id: "opt1", text: "Road maintenance", votes: 187, percentage: 45.4, voters: [] },
        { id: "opt2", text: "Public transit improvements", votes: 156, percentage: 37.9, voters: [] },
        { id: "opt3", text: "Bicycle infrastructure", votes: 69, percentage: 16.7, voters: [] }
      ],
      hasVoted: true,
      userVote: "opt2"
    },
    {
      id: "poll4",
      title: "Library Hours Extension",
      description: "Should the community library extend its opening hours?",
      status: "upcoming",
      startDate: "2025-04-15",
      endDate: "2025-05-15",
      totalVotes: 0,
      options: [
        { id: "opt1", text: "Yes, weekday evenings", votes: 0, percentage: 0, voters: [] },
        { id: "opt2", text: "Yes, weekend hours", votes: 0, percentage: 0, voters: [] },
        { id: "opt3", text: "No change needed", votes: 0, percentage: 0, voters: [] }
      ],
      hasVoted: false
    }
  ]);
  
  const [initiatives, setInitiatives] = useState<Initiative[]>([
    {
      id: "init1",
      title: "Community Garden Project",
      description: "Proposal to convert the vacant lot on Oak Street into a community garden with vegetable plots, flower beds, and a small orchard area.",
      category: "Environment",
      author: "Green Spaces Committee",
      createdDate: "2025-03-01",
      supporters: 183,
      opposers: 42,
      neutral: 25,
      totalResponses: 250,
      supportPercentage: 73.2,
      opposePercentage: 16.8,
      neutralPercentage: 10,
      userSupport: null,
      voters: []
    },
    {
      id: "init2",
      title: "Youth Coding Workshop Series",
      description: "Proposal to establish a free weekly coding workshop for youth ages 12-18 at the community center, using donated computers and volunteer instructors.",
      category: "Education",
      author: "Digital Skills Coalition",
      createdDate: "2025-03-10",
      supporters: 210,
      opposers: 15,
      neutral: 30,
      totalResponses: 255,
      supportPercentage: 82.4,
      opposePercentage: 5.9,
      neutralPercentage: 11.8,
      userSupport: null,
      voters: []
    },
    {
      id: "init3",
      title: "Downtown Pedestrian Zone",
      description: "Proposal to convert Main Street between 1st and 3rd Avenue into a pedestrian-only zone on weekends, allowing for outdoor dining, markets, and cultural events.",
      category: "Urban Planning",
      author: "Downtown Business Association",
      createdDate: "2025-02-15",
      supporters: 145,
      opposers: 97,
      neutral: 58,
      totalResponses: 300,
      supportPercentage: 48.3,
      opposePercentage: 32.3,
      neutralPercentage: 19.3,
      userSupport: null,
      voters: []
    }
  ]);
  
  // Effect to distribute voters among poll options
  useEffect(() => {
    // Distribute voters for polls
    const updatedPolls = polls.map(poll => {
      const pollVoters = [...mockVoters]; // Create a copy to avoid modifying the original
      const updatedOptions = distributeVoters(poll.options, pollVoters);
      return {...poll, options: updatedOptions};
    });
    
    setPolls(updatedPolls);
    
    // Distribute voters for initiatives
    const updatedInitiatives = initiatives.map(initiative => {
      const supportVoters = mockVoters.slice(0, Math.floor(mockVoters.length * (initiative.supportPercentage / 100))).map(voter => ({...voter, vote: "Support"}));
      const opposeVoters = mockVoters.slice(supportVoters.length, supportVoters.length + Math.floor(mockVoters.length * (initiative.opposePercentage / 100))).map(voter => ({...voter, vote: "Oppose"}));
      const neutralVoters = mockVoters.slice(supportVoters.length + opposeVoters.length).map(voter => ({...voter, vote: "Neutral"}));
      
      return {...initiative, voters: [...supportVoters, ...opposeVoters, ...neutralVoters]};
    });
    
    setInitiatives(updatedInitiatives);
  }, []);
  
  // Handle voting on a poll
  const handleVote = (pollId: string, optionId: string) => {
    setPolls(currentPolls => 
      currentPolls.map(poll => {
        if (poll.id === pollId) {
          // Update vote counts
          const updatedOptions = poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });
          
          // Recalculate percentages
          const newTotalVotes = poll.totalVotes + 1;
          const optionsWithPercentages = updatedOptions.map(option => ({
            ...option,
            percentage: Math.round((option.votes / newTotalVotes) * 1000) / 10
          }));
          
          return {
            ...poll,
            options: optionsWithPercentages,
            totalVotes: newTotalVotes,
            hasVoted: true,
            userVote: optionId
          };
        }
        return poll;
      })
    );
    
    toast({
      title: "Vote Recorded",
      description: "Thank you for participating in this poll."
    });
  };
  
  // Handle initiative support/oppose
  const handleSupportInitiative = (initiativeId: string, stance: "support" | "oppose" | "neutral") => {
    setInitiatives(current => 
      current.map(initiative => {
        if (initiative.id === initiativeId) {
          // If user already supported/opposed, remove their previous stance
          const previousStance = initiative.userSupport;
          let newSupporters = initiative.supporters;
          let newOpposers = initiative.opposers;
          let newNeutral = initiative.neutral;
          
          // Remove previous support if any
          if (previousStance === "support") newSupporters--;
          if (previousStance === "oppose") newOpposers--;
          if (previousStance === "neutral") newNeutral--;
          
          // Add new support
          if (stance === "support") newSupporters++;
          if (stance === "oppose") newOpposers++;
          if (stance === "neutral") newNeutral++;
          
          // Calculate new total and percentages
          const newTotal = newSupporters + newOpposers + newNeutral;
          
          return {
            ...initiative,
            supporters: newSupporters,
            opposers: newOpposers,
            neutral: newNeutral,
            totalResponses: newTotal,
            supportPercentage: Math.round((newSupporters / newTotal) * 1000) / 10,
            opposePercentage: Math.round((newOpposers / newTotal) * 1000) / 10,
            neutralPercentage: Math.round((newNeutral / newTotal) * 1000) / 10,
            userSupport: stance
          };
        }
        return initiative;
      })
    );
    
    toast({
      title: "Response Recorded",
      description: `You have ${stance}ed this initiative.`
    });
  };
  
  // Show voters dialog
  const handleShowVoters = (id: string, title: string, voters: Voter[]) => {
    setViewingVoters({
      id,
      title,
      voters
    });
    setIsVotersDialogOpen(true);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-green-600" />;
      case "ended":
        return <Check className="h-4 w-4 text-blue-600" />;
      case "upcoming":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "ended":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Voting</h1>
          <p className="text-muted-foreground">
            Participate in local decision-making by voting on community polls and supporting initiatives.
          </p>
        </div>
        
        <div className="flex space-x-2 border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "polls"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("polls")}
          >
            Polls
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "initiatives"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("initiatives")}
          >
            Initiatives
          </button>
        </div>
        
        {activeTab === "polls" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {polls.map((poll) => (
              <Card key={poll.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{poll.title}</CardTitle>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(poll.status)}`}>
                      {getStatusIcon(poll.status)}
                      {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{poll.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="space-y-4">
                    {poll.options.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{option.text}</span>
                          <span className={`${poll.hasVoted && poll.userVote === option.id ? 'font-bold text-primary' : ''}`}>
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={option.percentage} 
                            className={`h-2 ${poll.hasVoted && poll.userVote === option.id ? 'bg-primary/20' : 'bg-muted'}`}
                          />
                          {poll.hasVoted && poll.userVote === option.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 text-sm text-muted-foreground border-t flex justify-between items-center">
                    <div>
                      <span>Total votes: {poll.totalVotes}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(poll.endDate) > new Date() 
                          ? `Ends on ${new Date(poll.endDate).toLocaleDateString()}`
                          : `Ended on ${new Date(poll.endDate).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShowVoters(poll.id, poll.title, poll.options.flatMap(o => o.voters))}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Voters
                    </Button>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4 bg-muted/10">
                  {poll.hasVoted ? (
                    <div className="text-sm text-muted-foreground">
                      {poll.status === "ended" 
                        ? "This poll has ended." 
                        : "You have already voted on this poll."}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {poll.status === "upcoming" 
                        ? "This poll is not yet open for voting." 
                        : poll.status === "ended" 
                          ? "This poll has ended." 
                          : "Select an option to vote:"}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {!poll.hasVoted && poll.status === "active" && (
                      <div className="flex gap-2">
                        {poll.options.map((option) => (
                          <Button
                            key={option.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(poll.id, option.id)}
                          >
                            Option {parseInt(option.id.replace("opt", ""))}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedPoll(poll)}
                    >
                      Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {activeTab === "initiatives" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((initiative) => (
              <Card key={initiative.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{initiative.title}</CardTitle>
                    <Badge variant="outline">{initiative.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {initiative.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1 text-green-600" />
                          Support
                        </span>
                        <span>
                          {initiative.supporters} ({initiative.supportPercentage}%)
                        </span>
                      </div>
                      <Progress 
                        value={initiative.supportPercentage} 
                        className={`h-2 bg-green-100`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium flex items-center">
                          <ThumbsDown className="h-4 w-4 mr-1 text-red-600" />
                          Oppose
                        </span>
                        <span>
                          {initiative.opposers} ({initiative.opposePercentage}%)
                        </span>
                      </div>
                      <Progress 
                        value={initiative.opposePercentage} 
                        className={`h-2 bg-red-100`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium flex items-center">
                          <Minus className="h-4 w-4 mr-1 text-gray-600" />
                          Neutral
                        </span>
                        <span>
                          {initiative.neutral} ({initiative.neutralPercentage}%)
                        </span>
                      </div>
                      <Progress 
                        value={initiative.neutralPercentage} 
                        className={`h-2 bg-gray-100`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 text-sm text-muted-foreground border-t flex justify-between items-center">
                    <div>
                      <span>Total responses: {initiative.totalResponses}</span>
                      <span className="mx-2">•</span>
                      <span>
                        Proposed: {new Date(initiative.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShowVoters(initiative.id, initiative.title, initiative.voters)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Respondents
                    </Button>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4 bg-muted/10">
                  {initiative.userSupport ? (
                    <div className="text-sm">
                      Your stance: <Badge className={
                        initiative.userSupport === "support" ? "bg-green-100 text-green-800" :
                        initiative.userSupport === "oppose" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {initiative.userSupport.charAt(0).toUpperCase() + initiative.userSupport.slice(1)}
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Register your stance on this initiative:
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant={initiative.userSupport === "support" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSupportInitiative(initiative.id, "support")}
                      className={initiative.userSupport === "support" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Support
                    </Button>
                    
                    <Button
                      variant={initiative.userSupport === "oppose" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSupportInitiative(initiative.id, "oppose")}
                      className={initiative.userSupport === "oppose" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Oppose
                    </Button>
                    
                    <Button
                      variant={initiative.userSupport === "neutral" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSupportInitiative(initiative.id, "neutral")}
                      className={initiative.userSupport === "neutral" ? "bg-gray-600 hover:bg-gray-700" : ""}
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Neutral
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Voters Dialog */}
      <Dialog open={isVotersDialogOpen} onOpenChange={setIsVotersDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voters for {viewingVoters.title}</DialogTitle>
            <DialogDescription>
              List of people who have participated in this {activeTab === "polls" ? "poll" : "initiative"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {viewingVoters.voters.length > 0 ? (
                viewingVoters.voters.map((voter, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={voter.avatar} alt={voter.name} />
                        <AvatarFallback>{voter.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{voter.name}</span>
                    </div>
                    <Badge variant="outline">{voter.vote}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No voters yet.</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsVotersDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Poll Detail Modal */}
      {selectedPoll && (
        <Dialog open={!!selectedPoll} onOpenChange={() => setSelectedPoll(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPoll.title}</DialogTitle>
              <DialogDescription>{selectedPoll.description}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge className={getStatusColor(selectedPoll.status)}>
                    {selectedPoll.status.charAt(0).toUpperCase() + selectedPoll.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Total Votes:</span> {selectedPoll.totalVotes}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(selectedPoll.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(selectedPoll.endDate).toLocaleDateString()}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Voting Options</h3>
                
                {selectedPoll.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">{option.text}</span>
                        {selectedPoll.hasVoted && selectedPoll.userVote === option.id && (
                          <Badge className="ml-2 bg-primary text-primary-foreground">Your Vote</Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        {option.votes} votes ({option.percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={option.percentage} 
                      className={`h-3 ${selectedPoll.hasVoted && selectedPoll.userVote === option.id ? 'bg-primary/20' : 'bg-muted'}`}
                    />
                  </div>
                ))}
              </div>
              
              {!selectedPoll.hasVoted && selectedPoll.status === "active" && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Cast Your Vote</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedPoll.options.map((option) => (
                        <Button
                          key={option.id}
                          onClick={() => {
                            handleVote(selectedPoll.id, option.id);
                            setSelectedPoll(null);
                          }}
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleShowVoters(selectedPoll.id, selectedPoll.title, selectedPoll.options.flatMap(o => o.voters))}
              >
                <Users className="h-4 w-4 mr-1" />
                View Voters
              </Button>
              <Button onClick={() => setSelectedPoll(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default Voting;
