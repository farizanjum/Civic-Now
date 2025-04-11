import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, Clock, Check, X, AlertTriangle, Edit, Trash2, MoreHorizontal } from "lucide-react";

// Mock initiatives data
const mockInitiatives = [
  {
    id: 1,
    title: "Community Garden Project",
    status: "Active",
    category: "Environment",
    location: "Westside Park",
    submittedBy: "Maria Rodriguez",
    submittedOn: "2025-02-15",
    supporters: 142,
  },
  {
    id: 2,
    title: "Youth Coding Workshop",
    status: "Pending Review",
    category: "Education",
    location: "Community Center",
    submittedBy: "James Chen",
    submittedOn: "2025-03-01",
    supporters: 89,
  },
  {
    id: 3,
    title: "Street Safety Improvements",
    status: "Under Review",
    category: "Infrastructure",
    location: "Oak Avenue",
    submittedBy: "David Wilson",
    submittedOn: "2025-01-28",
    supporters: 215,
  },
  {
    id: 4,
    title: "Neighborhood Watch Program",
    status: "Rejected",
    category: "Safety",
    location: "Citywide",
    submittedBy: "Laura Johnson",
    submittedOn: "2025-02-05",
    supporters: 76,
  },
  {
    id: 5,
    title: "Community Art Installation",
    status: "Completed",
    category: "Culture",
    location: "Central Square",
    submittedBy: "Michael Zhang",
    submittedOn: "2025-01-10",
    supporters: 198,
  },
];

const AdminInitiatives = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInitiative, setSelectedInitiative] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter initiatives based on search term and status
  const filteredInitiatives = mockInitiatives.filter((initiative) => {
    return (
      initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || initiative.status === statusFilter)
    );
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending Review":
        return "bg-purple-100 text-purple-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Check className="h-4 w-4" />;
      case "Completed":
        return <Check className="h-4 w-4" />;
      case "Under Review":
        return <Clock className="h-4 w-4" />;
      case "Pending Review":
        return <Clock className="h-4 w-4" />;
      case "Rejected":
        return <X className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const handleActionClick = (action: string, initiative: any) => {
    setSelectedInitiative(initiative);
    
    switch (action) {
      case "approve":
        toast({
          title: "Initiative Approved",
          description: `"${initiative.title}" has been approved.`,
        });
        break;
      case "reject":
        toast({
          title: "Initiative Rejected",
          description: `"${initiative.title}" has been rejected.`,
        });
        break;
      case "view":
        setIsDialogOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Community Initiatives</CardTitle>
          <CardDescription>Review, approve, and track community-submitted initiatives</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search initiatives..."
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
                    <SelectItem value="all_status">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                <div className="col-span-4">Initiative Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Submitted By</div>
                <div className="col-span-1">Supporters</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {filteredInitiatives.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No initiatives found matching your criteria.</p>
                </div>
              ) : (
                filteredInitiatives.map((initiative) => (
                  <div key={initiative.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 items-center">
                    <div className="col-span-4 font-medium truncate" title={initiative.title}>
                      {initiative.title}
                    </div>
                    <div className="col-span-2">
                      <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(initiative.status)}`}>
                        {getStatusIcon(initiative.status)}
                        {initiative.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-muted-foreground">{initiative.category}</div>
                    <div className="col-span-2 text-muted-foreground">{initiative.submittedBy}</div>
                    <div className="col-span-1">{initiative.supporters}</div>
                    <div className="col-span-1 flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleActionClick("view", initiative)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Initiative Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedInitiative && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedInitiative.title}</DialogTitle>
                <DialogDescription>
                  Submitted by {selectedInitiative.submittedBy} on {new Date(selectedInitiative.submittedOn).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 mb-2">
                  <Badge className={getStatusColor(selectedInitiative.status)}>
                    {selectedInitiative.status}
                  </Badge>
                  <Badge variant="outline">{selectedInitiative.category}</Badge>
                  <Badge variant="secondary">{selectedInitiative.location}</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                    <p className="text-muted-foreground text-sm">
                      This is a mock description for the selected initiative. In an actual implementation, 
                      this would display the full description provided by the submitter, explaining the 
                      goal of the initiative, its implementation details, and expected impact on the community.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Supporters</h4>
                      <p className="text-xl font-medium">{selectedInitiative.supporters}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Comments</h4>
                      <p className="text-xl font-medium">24</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Timeline</h4>
                    <p className="text-muted-foreground text-sm">Estimated completion: 3-6 months</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-2">Admin Actions</h4>
                  <div className="flex gap-2">
                    {selectedInitiative.status === "Pending Review" || selectedInitiative.status === "Under Review" ? (
                      <>
                        <Button 
                          variant="default" 
                          className="bg-green-600 hover:bg-green-700" 
                          onClick={() => {
                            handleActionClick("approve", selectedInitiative);
                            setIsDialogOpen(false);
                          }}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve Initiative
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleActionClick("reject", selectedInitiative);
                            setIsDialogOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Initiative
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Status
                        </Button>
                        <Button variant="outline">Add Comment</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInitiatives;
