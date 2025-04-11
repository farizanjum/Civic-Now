
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter, MoreHorizontal, Plus, FilePenLine, Trash2, Check, X } from "lucide-react";

// Mock data for legislation
const legislationData = [
  {
    id: "L123",
    title: "Urban Green Space Expansion Act",
    status: "Active",
    category: "Environment",
    dateSubmitted: "2025-02-15",
    summary: "Proposal to increase green spaces in urban areas by 15% over the next 5 years.",
    votes: { for: 125, against: 45 },
  },
  {
    id: "L124",
    title: "Public Transportation Improvement Bill",
    status: "Draft",
    category: "Infrastructure",
    dateSubmitted: "2025-03-01",
    summary: "Plan to upgrade public transit systems and improve accessibility across the city.",
    votes: { for: 0, against: 0 },
  },
  {
    id: "L125",
    title: "Community Safety Initiative",
    status: "Under Review",
    category: "Safety",
    dateSubmitted: "2025-03-10",
    summary: "Comprehensive plan to enhance community safety through increased patrols and neighborhood watch programs.",
    votes: { for: 78, against: 23 },
  },
  {
    id: "L126",
    title: "Local Business Support Program",
    status: "Active",
    category: "Economy",
    dateSubmitted: "2025-02-28",
    summary: "Program to provide grants and resources to local small businesses affected by economic challenges.",
    votes: { for: 218, against: 32 },
  },
  {
    id: "L127",
    title: "Educational Resources Modernization",
    status: "Completed",
    category: "Education",
    dateSubmitted: "2025-01-20",
    summary: "Initiative to update educational resources and technology in public schools to enhance learning outcomes.",
    votes: { for: 189, against: 56 },
  },
];

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters.").max(100, "Title must be less than 100 characters."),
  category: z.string().min(1, "Please select a category."),
  summary: z.string().min(50, "Summary must be at least 50 characters.").max(500, "Summary must be less than 500 characters."),
  fullText: z.string().min(100, "Full text must be at least 100 characters."),
  sponsors: z.string().optional(),
  effectiveDate: z.date().optional(),
});

const AdminLegislation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      summary: "",
      fullText: "",
      sponsors: "",
    },
  });
  
  // Filter legislation based on search term and status
  const filteredLegislation = legislationData.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || item.status === statusFilter)
    );
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form values:", values);
    
    // Close dialog and show success message
    setIsCreateDialogOpen(false);
    form.reset();
    
    toast({
      title: "Legislation created",
      description: "The legislation has been successfully created.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Manage Legislation</CardTitle>
            <CardDescription>Create, edit, and manage legislation proposals</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Legislation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Legislation</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new legislation proposal.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="details">Details & Scheduling</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter legislation title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="Safety">Safety</SelectItem>
                                <SelectItem value="Economy">Economy</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Housing">Housing</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                              </SelectContent>
                            </Select>
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
                                placeholder="Brief summary of the legislation" 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="fullText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Text</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Complete legislation text" 
                                className="min-h-64"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="sponsors"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sponsors</FormLabel>
                              <FormControl>
                                <Input placeholder="Names of sponsors" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="effectiveDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Effective Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Legislation</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search legislation..."
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
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1 text-center">Votes</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {filteredLegislation.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No legislation found matching your criteria.</p>
                </div>
              ) : (
                filteredLegislation.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 items-center">
                    <div className="col-span-4 font-medium truncate" title={item.title}>
                      {item.title}
                    </div>
                    <div className="col-span-2">
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div className="col-span-2 text-muted-foreground">{item.category}</div>
                    <div className="col-span-2 text-muted-foreground">
                      {new Date(item.dateSubmitted).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-green-600 font-medium">{item.votes.for}</span>
                      <span className="mx-1">/</span>
                      <span className="text-red-600 font-medium">{item.votes.against}</span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Edit">
                        <FilePenLine className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLegislation;
