
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, Search, FilePlus, FileText, Check, Clock, AlertTriangle, 
  MoreHorizontal, Upload, X, Calendar, MapPin, Trash2, Edit, Copy, Save
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Define legislation type to ensure type safety
type LegislationItem = {
  id: string;
  title: string;
  status: string;
  author: string;
  dateCreated: string;
  lastUpdated: string;
  datePublished?: string;
  dateArchived?: string;
};

// Mock data for legislation
const mockLegislation: LegislationItem[] = [
  {
    id: "L1",
    title: "Community Park Expansion Proposal",
    status: "In Progress",
    author: "Council Member Sharma",
    dateCreated: "2025-03-15",
    lastUpdated: "2025-04-01",
  },
  {
    id: "L2",
    title: "Residential Zoning Amendment for Bengaluru Suburbs",
    status: "Review",
    author: "Urban Planning Department",
    dateCreated: "2025-03-10",
    lastUpdated: "2025-03-28",
  },
  {
    id: "L3",
    title: "Public Transportation Funding Initiative for Delhi Metro",
    status: "Approved",
    author: "Transportation Committee",
    dateCreated: "2025-02-20",
    lastUpdated: "2025-03-25",
  },
  {
    id: "L4",
    title: "Small Business Support Program for Mumbai Entrepreneurs",
    status: "Published",
    author: "Economic Development Office",
    dateCreated: "2025-02-05",
    lastUpdated: "2025-03-15",
    datePublished: "2025-03-15",
  },
  {
    id: "L5",
    title: "Historic District Preservation Guidelines for Jaipur",
    status: "Published",
    author: "Heritage Preservation Board",
    dateCreated: "2025-01-20",
    lastUpdated: "2025-02-28",
    datePublished: "2025-02-28",
  },
  {
    id: "L6",
    title: "Annual Budget Allocation 2024-2025 for Chennai Corporation",
    status: "Archived",
    author: "Finance Department",
    dateCreated: "2024-11-10",
    lastUpdated: "2025-01-15",
    datePublished: "2025-01-15",
    dateArchived: "2025-03-30",
  },
];

// Categories for India
const indianCategories = [
  "Environment & Sustainability",
  "Urban Development",
  "Transportation",
  "Housing",
  "Economic Development",
  "Infrastructure",
  "Education",
  "Healthcare",
  "Water & Sanitation",
  "Agriculture & Rural Development"
];

// Locations in India
const indianLocations = [
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Statewide",
  "Nationwide"
];

const AdminLegislation = () => {
  const [activeTab, setActiveTab] = useState("drafts");
  const [statusFilter, setStatusFilter] = useState("all_status");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLegislation, setSelectedLegislation] = useState<LegislationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [legislationList, setLegislationList] = useState<LegislationItem[]>(mockLegislation);
  const [isEditing, setIsEditing] = useState(false);
  
  // Create legislation form
  const createForm = useForm({
    defaultValues: {
      title: "",
      summary: "",
      category: "",
      fullText: "",
      neighborhoods: [] as string[],
      status: "In Progress"
    }
  });

  // Edit legislation form
  const editForm = useForm({
    defaultValues: {
      title: selectedLegislation?.title || "",
      summary: "",
      category: "",
      fullText: "",
      neighborhoods: [] as string[],
      status: selectedLegislation?.status || "In Progress"
    }
  });
  
  // Filter legislation based on active tab, search term, and status filter
  const filteredLegislation = legislationList.filter((item) => {
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };
  
  // Handle creating new legislation
  const handleCreateLegislation = (data: any) => {
    const newLegislation: LegislationItem = {
      id: `L${legislationList.length + 1}`,
      title: data.title,
      status: data.status,
      author: "Current User",
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setLegislationList(prev => [newLegislation, ...prev]);
    setIsCreateDialogOpen(false);
    createForm.reset();
    setUploadedFiles([]);
    
    toast({
      title: "Legislation Created",
      description: `"${data.title}" has been created successfully.`,
    });
  };

  // Handle editing legislation
  const handleEditLegislation = (data: any) => {
    if (!selectedLegislation) return;
    
    setLegislationList(prev => 
      prev.map(item => 
        item.id === selectedLegislation.id
          ? { ...item, title: data.title, status: data.status, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    setIsEditing(false);
    setIsDialogOpen(false);
    toast({
      title: "Legislation Updated",
      description: `"${data.title}" has been updated successfully.`,
    });
  };

  // Handle deleting legislation
  const handleDeleteLegislation = () => {
    if (!selectedLegislation) return;
    
    setLegislationList(prev => prev.filter(item => item.id !== selectedLegislation.id));
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
    toast({
      title: "Legislation Deleted",
      description: `"${selectedLegislation.title}" has been deleted.`,
    });
  };
  
  const handleActionClick = (action: string, legislation: LegislationItem) => {
    setSelectedLegislation(legislation);
    
    switch (action) {
      case "view":
        editForm.reset({
          title: legislation.title,
          summary: "Example summary for " + legislation.title,
          category: "Environment & Sustainability",
          fullText: "This is a placeholder for the full text of " + legislation.title,
          neighborhoods: ["Delhi NCR"],
          status: legislation.status
        });
        setIsDialogOpen(true);
        break;
      case "publish":
        setLegislationList(prev => 
          prev.map(item => 
            item.id === legislation.id
              ? { 
                  ...item, 
                  status: "Published", 
                  lastUpdated: new Date().toISOString().split('T')[0], 
                  datePublished: new Date().toISOString().split('T')[0] 
                }
              : item
          )
        );
        toast({
          title: "Legislation Published",
          description: `"${legislation.title}" has been published.`,
        });
        break;
      case "archive":
        setLegislationList(prev => 
          prev.map(item => 
            item.id === legislation.id
              ? { 
                  ...item, 
                  status: "Archived", 
                  lastUpdated: new Date().toISOString().split('T')[0], 
                  dateArchived: new Date().toISOString().split('T')[0] 
                }
              : item
          )
        );
        toast({
          title: "Legislation Archived",
          description: `"${legislation.title}" has been archived.`,
        });
        break;
      case "edit":
        setIsEditing(true);
        break;
      case "delete":
        setIsDeleteDialogOpen(true);
        break;
      default:
        break;
    }
  };

  // Upload documents for the existing legislation
  const handleUploadDocuments = () => {
    setIsUploadDialogOpen(false);
    setUploadedFiles([]);
    toast({
      title: "Documents Uploaded",
      description: `${uploadedFiles.length} document(s) uploaded for "${selectedLegislation?.title}".`,
    });
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
      
      <Button className="w-full sm:w-auto" onClick={() => setIsCreateDialogOpen(true)}>
        <FilePlus className="h-4 w-4 mr-2" />
        Create New Legislation
      </Button>
      
      {/* Legislation Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsEditing(false);
      }}>
        <DialogContent className="max-w-2xl">
          {selectedLegislation && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Legislation" : selectedLegislation.title}
                </DialogTitle>
                <DialogDescription>
                  {!isEditing && `Created by ${selectedLegislation.author} on ${new Date(selectedLegislation.dateCreated).toLocaleDateString()}`}
                </DialogDescription>
              </DialogHeader>
              
              {isEditing ? (
                <form onSubmit={editForm.handleSubmit(handleEditLegislation)}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        {...editForm.register("title", { required: true })}
                      />
                      {editForm.formState.errors.title && (
                        <p className="text-sm text-destructive">Title is required</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea 
                        id="summary" 
                        {...editForm.register("summary")}
                        placeholder="Brief summary of the legislation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        defaultValue={selectedLegislation.status}
                        onValueChange={(value) => editForm.setValue("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Select Areas</Label>
                      <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                        {indianLocations.slice(0, 8).map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`location-${location}`} 
                              onCheckedChange={(checked) => {
                                const currentLocations = editForm.getValues("neighborhoods") || [];
                                if (checked) {
                                  editForm.setValue("neighborhoods", [...currentLocations, location]);
                                } else {
                                  editForm.setValue(
                                    "neighborhoods", 
                                    currentLocations.filter(loc => loc !== location)
                                  );
                                }
                              }}
                            />
                            <label 
                              htmlFor={`location-${location}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {location}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              ) : (
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
                        {selectedLegislation.title.includes("Park") ? 
                          "This legislation aims to expand community parks and green spaces in targeted neighborhoods, enhancing quality of life for residents and promoting environmental sustainability." :
                          selectedLegislation.title.includes("Zoning") ?
                          "A proposed amendment to current zoning regulations to allow mixed-use development in selected residential areas, promoting sustainable urban growth and affordable housing options." :
                          "This legislation addresses key civic needs through comprehensive policy changes and strategic resource allocation, with careful consideration for community impact and long-term sustainability."}
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

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Documents</h4>
                      <div className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm">3 documents attached</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsUploadDialogOpen(true)}
                          >
                            <Upload size={14} className="mr-1" /> Upload More
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          <li className="text-sm flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={14} className="mr-2 text-blue-600" />
                              <span>Main Document.pdf</span>
                            </div>
                            <span className="text-xs text-muted-foreground">2.4 MB</span>
                          </li>
                          <li className="text-sm flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={14} className="mr-2 text-green-600" />
                              <span>Budget.xlsx</span>
                            </div>
                            <span className="text-xs text-muted-foreground">1.1 MB</span>
                          </li>
                          <li className="text-sm flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={14} className="mr-2 text-purple-600" />
                              <span>Supporting Data.pdf</span>
                            </div>
                            <span className="text-xs text-muted-foreground">3.7 MB</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-2">Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLegislation.status === "Approved" && (
                        <Button 
                          variant="default" 
                          onClick={() => handleActionClick("publish", selectedLegislation)}
                        >
                          Publish Legislation
                        </Button>
                      )}
                      {selectedLegislation.status === "Published" && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleActionClick("archive", selectedLegislation)}
                        >
                          Archive Legislation
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => handleActionClick("edit", selectedLegislation)}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="outline">
                        <Copy size={14} className="mr-1" /> Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleActionClick("delete", selectedLegislation)}
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create New Legislation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Legislation</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new piece of legislation
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={createForm.handleSubmit(handleCreateLegislation)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <Input 
                  id="create-title" 
                  placeholder="Enter legislation title"
                  {...createForm.register("title", { required: true })}
                />
                {createForm.formState.errors.title && (
                  <p className="text-sm text-destructive">Title is required</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-summary">Summary</Label>
                <Textarea 
                  id="create-summary" 
                  placeholder="Brief summary of the legislation"
                  {...createForm.register("summary")}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-category">Category</Label>
                  <Select onValueChange={(value) => createForm.setValue("category", value)}>
                    <SelectTrigger id="create-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-status">Initial Status</Label>
                  <Select 
                    defaultValue="In Progress"
                    onValueChange={(value) => createForm.setValue("status", value)}
                  >
                    <SelectTrigger id="create-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Select Affected Areas</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-md p-3">
                  {indianLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`create-location-${location}`} 
                        onCheckedChange={(checked) => {
                          const currentLocations = createForm.getValues("neighborhoods") || [];
                          if (checked) {
                            createForm.setValue("neighborhoods", [...currentLocations, location]);
                          } else {
                            createForm.setValue(
                              "neighborhoods", 
                              currentLocations.filter(loc => loc !== location)
                            );
                          }
                        }}
                      />
                      <label 
                        htmlFor={`create-location-${location}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Upload Documents</Label>
                <div className="border rounded-md p-3">
                  <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload files</span>
                      <span className="text-xs text-muted-foreground">PDF, DOCX, XLSX, up to 10MB each</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        onChange={handleFileUpload}
                        accept=".pdf,.docx,.xlsx,.csv,.txt"
                      />
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                      <ul className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                            <div className="flex items-center">
                              <FileText size={14} className="mr-2 text-blue-600" />
                              <span className="truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => handleRemoveFile(index)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Legislation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this legislation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">{selectedLegislation?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Status: {selectedLegislation?.status}
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteLegislation}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Files Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Add supporting documents to "{selectedLegislation?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">Click to upload files</span>
                <span className="text-xs text-muted-foreground">PDF, DOCX, XLSX, up to 10MB each</span>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.xlsx,.csv,.txt"
                />
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                      <div className="flex items-center">
                        <FileText size={14} className="mr-2 text-blue-600" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUploadDocuments}
              disabled={uploadedFiles.length === 0}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLegislation;
