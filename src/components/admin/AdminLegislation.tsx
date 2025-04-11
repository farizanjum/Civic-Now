
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Edit, Trash2, Eye, X, Check, Filter, Download, FileDown, FileUp, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Define type for legislation items
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

// Schema for legislation form
const legislationFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  summary: z.string().min(10, {
    message: "Summary must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  locations: z.string({
    required_error: "Please specify affected locations.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  content: z.string().min(30, {
    message: "Content must be at least 30 characters.",
  }),
});

type LegislationFormValues = z.infer<typeof legislationFormSchema>;

const AdminLegislation = () => {
  const isMobile = useIsMobile();
  const [isNewLegislationDialogOpen, setIsNewLegislationDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedLegislation, setSelectedLegislation] = useState<LegislationItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Initialize form
  const form = useForm<LegislationFormValues>({
    resolver: zodResolver(legislationFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      category: "",
      locations: "",
      status: "draft",
      content: "",
    },
  });

  // Sample data for legislation items
  const [legislationList, setLegislationList] = useState<LegislationItem[]>([
    {
      id: "leg-001",
      title: "Urban Green Space Improvement Act",
      status: "published",
      author: "Parks Committee",
      dateCreated: "2023-03-15",
      lastUpdated: "2023-03-25",
      datePublished: "2023-03-28",
    },
    {
      id: "leg-002",
      title: "Public Transportation Subsidy Proposal",
      status: "draft",
      author: "Transport Division",
      dateCreated: "2023-03-18",
      lastUpdated: "2023-04-01",
    },
    {
      id: "leg-003",
      title: "Small Business Recovery Grant Program",
      status: "review",
      author: "Economic Committee",
      dateCreated: "2023-03-20",
      lastUpdated: "2023-03-30",
    },
    {
      id: "leg-004",
      title: "Clean Water Infrastructure Investment",
      status: "published",
      author: "Environmental Division",
      dateCreated: "2023-02-10",
      lastUpdated: "2023-03-05",
      datePublished: "2023-03-10",
    },
    {
      id: "leg-005",
      title: "Affordable Housing Development Initiative",
      status: "archived",
      author: "Housing Committee",
      dateCreated: "2022-11-15",
      lastUpdated: "2023-01-20",
      datePublished: "2023-01-25",
      dateArchived: "2023-03-15",
    },
    {
      id: "leg-006",
      title: "Public School Funding Amendment",
      status: "review",
      author: "Education Department",
      dateCreated: "2023-03-25",
      lastUpdated: "2023-04-02",
    },
  ]);

  // Filter legislation based on tab and search term
  const filteredLegislation = legislationList.filter(leg => {
    const matchesTab = activeTab === "all" || leg.status === activeTab;
    const matchesSearch = leg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leg.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leg.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Function to handle form submission for new legislation
  const onSubmit = (data: LegislationFormValues) => {
    // If editing existing legislation
    if (selectedLegislation) {
      const updatedList = legislationList.map(item => 
        item.id === selectedLegislation.id 
          ? { 
              ...item, 
              title: data.title,
              status: data.status,
              lastUpdated: new Date().toISOString().split('T')[0]
            } 
          : item
      );
      
      setLegislationList(updatedList);
      
      toast({
        title: "Legislation Updated",
        description: "The legislation has been successfully updated.",
      });
    } else {
      // Creating new legislation
      const newLegislation: LegislationItem = {
        id: `leg-${String(legislationList.length + 1).padStart(3, '0')}`,
        title: data.title,
        status: data.status,
        author: "Current Admin",
        dateCreated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      // Add published date if status is published
      if (data.status === "published") {
        newLegislation.datePublished = new Date().toISOString().split('T')[0];
      }
      
      setLegislationList([newLegislation, ...legislationList]);
      
      toast({
        title: "Legislation Created",
        description: "New legislation has been successfully created.",
      });
    }
    
    // Reset and close
    form.reset();
    setSelectedLegislation(null);
    setIsNewLegislationDialogOpen(false);
  };

  // Function to handle delete confirmation
  const handleDelete = () => {
    if (!deleteId) return;
    
    const updatedList = legislationList.filter(item => item.id !== deleteId);
    setLegislationList(updatedList);
    
    toast({
      title: "Legislation Deleted",
      description: "The legislation has been permanently removed.",
    });
    
    setDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  // Function to open edit dialog
  const handleEdit = (legislation: LegislationItem) => {
    setSelectedLegislation(legislation);
    
    // Set form values
    form.setValue("title", legislation.title);
    form.setValue("status", legislation.status);
    form.setValue("summary", "Sample summary for " + legislation.title);
    form.setValue("category", "General");
    form.setValue("locations", "All Areas");
    form.setValue("content", "This is placeholder content for " + legislation.title + ". In a real application, this would contain the full text of the legislation.");
    
    setIsNewLegislationDialogOpen(true);
  };

  // Function to handle status change
  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedList = legislationList.map(item => {
      if (item.id === id) {
        const updated = { 
          ...item, 
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Add published date if new status is published
        if (newStatus === "published" && !item.datePublished) {
          updated.datePublished = new Date().toISOString().split('T')[0];
        }
        
        // Add archived date if new status is archived
        if (newStatus === "archived" && !item.dateArchived) {
          updated.dateArchived = new Date().toISOString().split('T')[0];
        }
        
        return updated;
      }
      return item;
    });
    
    setLegislationList(updatedList);
    
    toast({
      title: "Status Updated",
      description: `Legislation status has been changed to ${newStatus}.`,
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-200 text-slate-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className={`${isMobile ? "p-4" : "pb-3"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Legislation Management</CardTitle>
              <CardDescription className="mt-1.5">
                Create, edit and manage legislation proposals
              </CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedLegislation(null);
              form.reset({
                title: "",
                summary: "",
                category: "",
                locations: "",
                status: "draft",
                content: "",
              });
              setIsNewLegislationDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search legislation..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <FileUp className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  toast({
                    title: "Refreshed",
                    description: "Legislation list has been refreshed.",
                  });
                }} className="h-9">
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Refresh</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="review">In Review</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="m-0">
                {filteredLegislation.length > 0 ? (
                  <div className={`border rounded-md ${isMobile ? "overflow-auto" : ""}`}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLegislation.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs">{item.id}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.author}</TableCell>
                            <TableCell className="text-muted-foreground">{item.dateCreated}</TableCell>
                            <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    toast({
                                      title: "View Legislation",
                                      description: `Viewing ${item.title}`,
                                    });
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setDeleteId(item.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  disabled={item.status === "published"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                                {item.status === "draft" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleStatusChange(item.id, "review")}
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Submit for Review</span>
                                  </Button>
                                )}
                                {item.status === "review" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleStatusChange(item.id, "published")}
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Approve</span>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">No legislation found.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setActiveTab("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* New Legislation Dialog */}
      <Dialog open={isNewLegislationDialogOpen} onOpenChange={setIsNewLegislationDialogOpen}>
        <DialogContent className={`${isMobile ? "max-w-full h-full" : "max-w-3xl"}`}>
          <DialogHeader>
            <DialogTitle>{selectedLegislation ? "Edit Legislation" : "Create New Legislation"}</DialogTitle>
            <DialogDescription>
              {selectedLegislation 
                ? "Update the details of the existing legislation." 
                : "Fill in the details to create a new legislative proposal."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter legislation title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive title for the legislation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Environment">Environment</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Housing">Housing</SelectItem>
                          <SelectItem value="Economic">Economic Development</SelectItem>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Locations</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter affected areas or locations" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify neighborhoods or areas affected by this legislation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a brief summary of the legislation" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      A concise summary that will appear in listings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the full text of the legislation" 
                        {...field} 
                        rows={7}
                      />
                    </FormControl>
                    <FormDescription>
                      The complete text of the legislation proposal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setSelectedLegislation(null);
                  setIsNewLegislationDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                {selectedLegislation ? "Update Legislation" : "Create Legislation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this legislation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="ml-2"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLegislation;
