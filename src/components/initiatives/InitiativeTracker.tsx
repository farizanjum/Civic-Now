
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronRight, Users, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";

// Mock data for initiative tracking
const mockInitiatives = [
  {
    id: 1,
    title: "Community Garden Project",
    progress: 75,
    status: "In Progress",
    startDate: "2025-01-15",
    estimatedCompletion: "2025-05-20",
    participantsCount: 32,
    updates: [
      { date: "2025-04-01", content: "Garden plots prepared and soil tested." },
      { date: "2025-03-15", content: "Secured funding for irrigation system." },
      { date: "2025-02-10", content: "Location approved by city council." },
      { date: "2025-01-20", content: "Initial volunteer meeting with 25 attendees." },
    ],
    milestones: [
      { title: "Site Selection", completed: true, date: "2025-01-15" },
      { title: "Budget Approval", completed: true, date: "2025-01-30" },
      { title: "Ground Preparation", completed: true, date: "2025-02-28" },
      { title: "Irrigation Installation", completed: true, date: "2025-03-20" },
      { title: "Plant First Crops", completed: false, date: "2025-04-15" },
      { title: "Community Opening Day", completed: false, date: "2025-05-15" },
    ],
  },
  {
    id: 2,
    title: "Youth Coding Workshop",
    progress: 30,
    status: "Planning",
    startDate: "2025-03-01",
    estimatedCompletion: "2025-06-15",
    participantsCount: 18,
    updates: [
      { date: "2025-03-25", content: "Secured 15 laptops for student use." },
      { date: "2025-03-10", content: "Curriculum development in progress." },
      { date: "2025-03-05", content: "Volunteer teachers confirmed: 3 local software developers." },
    ],
    milestones: [
      { title: "Venue Confirmation", completed: true, date: "2025-03-05" },
      { title: "Curriculum Finalized", completed: false, date: "2025-04-10" },
      { title: "Equipment Setup", completed: false, date: "2025-04-25" },
      { title: "Participant Registration", completed: false, date: "2025-05-10" },
      { title: "First Workshop Session", completed: false, date: "2025-05-20" },
    ],
  },
  {
    id: 3,
    title: "Street Safety Improvements",
    progress: 50,
    status: "Approved",
    startDate: "2025-01-28",
    estimatedCompletion: "2025-07-15",
    participantsCount: 8,
    updates: [
      { date: "2025-03-20", content: "City approved budget for crosswalk installation." },
      { date: "2025-03-01", content: "Traffic study completed with positive findings." },
      { date: "2025-02-15", content: "Community feedback collected: 95% support the initiative." },
      { date: "2025-02-01", content: "Initial proposal submitted to city council." },
    ],
    milestones: [
      { title: "Community Survey", completed: true, date: "2025-02-10" },
      { title: "Traffic Study", completed: true, date: "2025-02-28" },
      { title: "City Council Approval", completed: true, date: "2025-03-15" },
      { title: "Budget Allocation", completed: true, date: "2025-03-30" },
      { title: "Begin Construction", completed: false, date: "2025-04-20" },
      { title: "Project Completion", completed: false, date: "2025-07-10" },
    ],
  },
];

const InitiativeTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(1); // Default to first initiative being expanded
  
  const filteredInitiatives = mockInitiatives.filter(
    (initiative) => initiative.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-600";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="search-tracker" className="text-sm font-medium mb-2 block">
            Search Initiatives
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-tracker"
              placeholder="Search by initiative name"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" className="mb-[2px]">My Initiatives</Button>
      </div>

      <div className="space-y-4">
        {filteredInitiatives.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No initiatives found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or browse active initiatives.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInitiatives.map((initiative) => (
            <Card key={initiative.id} className={expandedId === initiative.id ? "border-civic-blue" : ""}>
              <Collapsible 
                open={expandedId === initiative.id} 
                onOpenChange={() => setExpandedId(expandedId === initiative.id ? null : initiative.id)}
              >
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <CollapsibleTrigger className="flex items-center gap-2 hover:text-civic-blue transition-colors">
                      {expandedId === initiative.id ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <h3 className="text-lg font-semibold">{initiative.title}</h3>
                    </CollapsibleTrigger>
                  </div>
                  <Badge className={getStatusColor(initiative.status)}>{initiative.status}</Badge>
                </div>
                <div className="px-6 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Progress value={initiative.progress} className={`h-2 ${getProgressColor(initiative.progress)}`} />
                    <span className="text-sm font-medium">{initiative.progress}%</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Started: {new Date(initiative.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Est. Completion: {new Date(initiative.estimatedCompletion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{initiative.participantsCount} participants</span>
                    </div>
                  </div>
                </div>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Tabs defaultValue="milestones">
                      <TabsList className="mb-4">
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                        <TabsTrigger value="updates">Updates</TabsTrigger>
                      </TabsList>
                      <TabsContent value="milestones" className="space-y-4">
                        <div className="space-y-2">
                          {initiative.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                              {milestone.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className={`font-medium ${milestone.completed ? 'text-muted-foreground' : ''}`}>
                                    {milestone.title}
                                  </h4>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(milestone.date).toLocaleDateString()}
                                  </span>
                                </div>
                                {!milestone.completed && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {new Date(milestone.date) > new Date() 
                                      ? `Due in ${Math.ceil((new Date(milestone.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` 
                                      : `Overdue by ${Math.ceil((new Date().getTime() - new Date(milestone.date).getTime()) / (1000 * 60 * 60 * 24))} days`
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="updates">
                        <div className="border-l-2 border-muted pl-4 space-y-4 ml-2">
                          {initiative.updates.map((update, index) => (
                            <div key={index} className="relative pb-4">
                              <div className="absolute -left-[21px] bg-background border-4 border-muted rounded-full h-4 w-4"></div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {new Date(update.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm">{update.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InitiativeTracker;
