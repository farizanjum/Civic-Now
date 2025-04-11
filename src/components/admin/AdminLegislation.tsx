
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, FilePlus, FileText, Check, Clock, AlertTriangle, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Mock data for legislation
const mockLegislation = [
  {
    id: "L1",
    title: "Community Park Expansion Proposal",
    status: "In Progress",
    author: "Council Member Johnson",
    dateCreated: "2025-03-15",
    lastUpdated: "2025-04-01",
  },
  {
    id: "L2",
    title: "Residential Zoning Amendment",
    status: "Review",
    author: "Urban Planning Department",
    dateCreated: "2025-03-10",
    lastUpdated: "2025-03-28",
  },
  {
    id: "L3",
    title: "Public Transportation Funding Initiative",
    status: "Approved",
    author: "Transportation Committee",
    dateCreated: "2025-02-20",
    lastUpdated: "2025-03-25",
  },
  {
    id: "L4",
    title: "Small Business Support Program",
    status: "Published",
    author: "Economic Development Office",
    dateCreated: "2025-02-05",
    lastUpdated: "2025-03-15",
    datePublished: "2025-03-15",
  },
  {
    id: "L5",
    title: "Historic District Preservation Guidelines",
    status: "Published",
    author: "Heritage Preservation Board",
    dateCreated: "2025-01-20",
    lastUpdated: "2025-02-28",
    datePublished: "2025-02-28",
  },
  {
    id: "L6",
    title: "Annual Budget Allocation 2024-2025",
    status: "Archived",
    author: "Finance Department",
    dateCreated: "2024-11-10",
    lastUpdated: "2025-01-15",
    datePublished: "2025-01-15",
    dateArchived: "2025-03-30",
  },
];

const AdminLegislation = () => {
  const [activeTab, setActiveTab] = useState("drafts");
  const [statusFilter, setStatusFilter] = useState("all_status");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLegislation, setSelectedLegislation] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter legislation based on active tab, search term, and status filter
  const filteredLegislation = mockLegislation.filter((item) => {
    // Filter by tab
    if (activeTab === "drafts" && (item.status === "In Progress" || item.status === "Review" || item.status === "Approved")) {
      // Filter by search and status
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all_status" || item.status === statusFilter)
      );
    } else if (activeTab === "published" && item.status === "Published") {
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all_status" || item.status === statusFilter)
      );
    } else if (activeTab === "archived" && item.status === "Archived") {
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all_status" || item.status === statusFilter)
      );
    }
    return false;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Published":
        return "bg-purple-100 text-purple-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Review":
        return <AlertTriangle className="h-4 w-4" />;
      case "Approved":
        return <Check className="h-4 w-4" />;
      case "Published":
        return <FileText className="h-4 w-4" />;
      case "Archived":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const handleActionClick = (action: string, legislation: any) => {
    setSelectedLegislation(legislation);
    
    switch (action) {
      case "view":
        setIsDialogOpen(true);
        break;
      case "publish":
        toast({
          title: "Legislation Published",
          description: `"${legislation.title}" has been published.`,
        });
        break;
      case "archive":
        toast({
          title: "Legislation Archived",
          description: `"${legislation.title}" has been archived.`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="drafts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search-legislation" className="text-sm font-medium mb-2 block">
              Search Legislation
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-legislation"
                placeholder="Search by title or keyword"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
              Filter by Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_status">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="drafts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Draft Legislation</CardTitle>
              <CardDescription>Manage legislation in progress, under review, or approved for publication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Author</div>
                  <div className="col-span-2">Last Updated</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {filteredLegislation.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No legislation found matching your criteria.</p>
                  </div>
                ) : (
                  filteredLegislation.map((legislation) => (
                    <div key={legislation.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 items-center">
                      <div className="col-span-5 font-medium truncate" title={legislation.title}>
                        {legislation.title}
                      </div>
                      <div className="col-span-2">
                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(legislation.status)}`}>
                          {getStatusIcon(legislation.status)}
                          {legislation.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground">{legislation.author}</div>
                      <div className="col-span-2 text-muted-foreground">
                        {new Date(legislation.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleActionClick("view", legislation)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Published Legislation</CardTitle>
              <CardDescription>View and manage legislation that has been published and is currently active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Author</div>
                  <div className="col-span-2">Published Date</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {filteredLegislation.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No published legislation found.</p>
                  </div>
                ) : (
                  filteredLegislation.map((legislation) => (
                    <div key={legislation.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 items-center">
                      <div className="col-span-5 font-medium truncate" title={legislation.title}>
                        {legislation.title}
                      </div>
                      <div className="col-span-2">
                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(legislation.status)}`}>
                          {getStatusIcon(legislation.status)}
                          {legislation.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground">{legislation.author}</div>
                      <div className="col-span-2 text-muted-foreground">
                        {new Date(legislation.datePublished || legislation.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleActionClick("view", legislation)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Archived Legislation</CardTitle>
              <CardDescription>View and reference legislation that has been archived</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Author</div>
                  <div className="col-span-2">Archived Date</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {filteredLegislation.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No archived legislation found.</p>
                  </div>
                ) : (
                  filteredLegislation.map((legislation) => (
                    <div key={legislation.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 items-center">
                      <div className="col-span-5 font-medium truncate" title={legislation.title}>
                        {legislation.title}
                      </div>
                      <div className="col-span-2">
                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(legislation.status)}`}>
                          {getStatusIcon(legislation.status)}
                          {legislation.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground">{legislation.author}</div>
                      <div className="col-span-2 text-muted-foreground">
                        {new Date(legislation.dateArchived || legislation.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleActionClick("view", legislation)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button className="w-full sm:w-auto">
        <FilePlus className="h-4 w-4 mr-2" />
        Create New Legislation
      </Button>
      
      {/* Legislation Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedLegislation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLegislation.title}</DialogTitle>
                <DialogDescription>
                  Created by {selectedLegislation.author} on {new Date(selectedLegislation.dateCreated).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 mb-2">
                  <Badge className={getStatusColor(selectedLegislation.status)}>
                    {selectedLegislation.status}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Summary</h4>
                    <p className="text-muted-foreground text-sm">
                      This is a mock summary for the selected legislation. In an actual implementation, 
                      this would display the full summary provided by the author, explaining the 
                      purpose of the legislation, its key provisions, and expected impact.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Timeline</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(selectedLegislation.dateCreated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{new Date(selectedLegislation.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      {selectedLegislation.datePublished && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Published:</span>
                          <span>{new Date(selectedLegislation.datePublished).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedLegislation.dateArchived && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Archived:</span>
                          <span>{new Date(selectedLegislation.dateArchived).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-2">Actions</h4>
                  <div className="flex gap-2">
                    {selectedLegislation.status === "Approved" && (
                      <Button 
                        variant="default" 
                        onClick={() => {
                          handleActionClick("publish", selectedLegislation);
                          setIsDialogOpen(false);
                        }}
                      >
                        Publish Legislation
                      </Button>
                    )}
                    {selectedLegislation.status === "Published" && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          handleActionClick("archive", selectedLegislation);
                          setIsDialogOpen(false);
                        }}
                      >
                        Archive Legislation
                      </Button>
                    )}
                    <Button variant="outline">Edit</Button>
                    <Button variant="outline">View Full Document</Button>
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

export default AdminLegislation;
