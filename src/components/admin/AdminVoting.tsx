import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as ChartTooltip } from "recharts";
import { format, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { 
  CalendarIcon, 
  Plus, 
  FileText, 
  BarChart2, 
  Check, 
  Clock, 
  X, 
  AlertCircle, 
  Edit, 
  Eye, 
  Users,
  Trash2
} from "lucide-react";

const INITIAL_ACTIVE_POLLS = [
  {
    id: "P1",
    title: "Community Center Improvement",
    status: "active" as const,
    startDate: "2025-03-01",
    endDate: "2025-04-15",
    totalVotes: 256,
    options: [
      { id: "opt1", label: "Renovate existing center", votes: 145 },
      { id: "opt2", label: "Build new facility", votes: 111 },
    ]
  },
  {
    id: "P2",
    title: "Park Amenities Selection",
    status: "active" as const,
    startDate: "2025-03-10",
    endDate: "2025-04-30",
    totalVotes: 189,
    options: [
      { id: "opt1", label: "Playground equipment", votes: 78 },
      { id: "opt2", label: "Walking trails", votes: 65 },
      { id: "opt3", label: "Picnic areas", votes: 46 },
    ]
  },
  {
    id: "P3",
    title: "Neighborhood Watch Program",
    status: "ended" as const,
    startDate: "2025-02-01",
    endDate: "2025-03-15",
    totalVotes: 312,
    options: [
      { id: "opt1", label: "Implement program", votes: 229 },
      { id: "opt2", label: "Do not implement", votes: 83 },
    ]
  },
  {
    id: "P4",
    title: "Library Hours Extension",
    status: "draft" as const,
    startDate: "2025-04-01",
    endDate: "2025-05-01",
    totalVotes: 0,
    options: [
      { id: "opt1", label: "Extend weekday hours", votes: 0 },
      { id: "opt2", label: "Add weekend hours", votes: 0 },
      { id: "opt3", label: "Keep current hours", votes: 0 },
    ]
  }
];

const mockVoters = [
  { id: "v1", name: "Alex Johnson", avatar: "/placeholder.svg", vote: "opt1" },
  { id: "v2", name: "Sarah Williams", avatar: "/placeholder.svg", vote: "opt2" },
  { id: "v3", name: "Michael Brown", avatar: "/placeholder.svg", vote: "opt1" },
  { id: "v4", name: "Emily Davis", avatar: "/placeholder.svg", vote: "opt3" },
  { id: "v5", name: "David Wilson", avatar: "/placeholder.svg", vote: "opt1" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const pollFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  options: z.array(
    z.object({
      label: z.string().min(1, { message: "Option text is required" }),
    })
  ).min(2, {
    message: "At least two options are required.",
  }),
  allowMultipleVotes: z.boolean().default(false),
  requireAuthentication: z.boolean().default(true),
});

type PollFormValues = z.infer<typeof pollFormSchema>;

type Poll = {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "active" | "ended";
  startDate: string;
  endDate: string;
  totalVotes: number;
  options: {
    id: string;
    label: string;
    votes: number;
  }[];
  allowMultipleVotes?: boolean;
  requireAuthentication?: boolean;
  voters?: typeof mockVoters;
};

const AdminVoting = () => {
  const [activePolls, setActivePolls] = useState<Poll[]>(INITIAL_ACTIVE_POLLS);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [isVotersDialogOpen, setIsVotersDialogOpen] = useState(false);
  
  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      options: [{ label: "" }, { label: "" }],
      allowMultipleVotes: false,
      requireAuthentication: true,
    },
  });
  
  const filteredPolls = activePolls.filter(poll => {
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && poll.status === "active") ||
      (activeTab === "draft" && poll.status === "draft") ||
      (activeTab === "ended" && poll.status === "ended");
    
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const onNewPoll = () => {
    setIsEditMode(false);
    form.reset({
      title: "",
      description: "",
      status: "draft",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      options: [{ label: "" }, { label: "" }],
      allowMultipleVotes: false,
      requireAuthentication: true,
    });
    setIsDialogOpen(true);
  };
  
  const onEditPoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsEditMode(true);
    
    form.reset({
      title: poll.title,
      description: poll.description || "",
      status: poll.status,
      startDate: new Date(poll.startDate),
      endDate: new Date(poll.endDate),
      options: poll.options.map(option => ({ label: option.label })),
      allowMultipleVotes: poll.allowMultipleVotes || false,
      requireAuthentication: poll.requireAuthentication || true,
    });
    
    setIsDialogOpen(true);
  };
  
  const onSubmit = (data: PollFormValues) => {
    if (isEditMode && selectedPoll) {
      const updatedPolls = activePolls.map(poll => 
        poll.id === selectedPoll.id 
          ? {
              ...poll,
              title: data.title,
              description: data.description,
              status: data.status as "draft" | "active" | "ended",
              startDate: format(data.startDate, "yyyy-MM-dd"),
              endDate: format(data.endDate, "yyyy-MM-dd"),
              options: data.options.map((option, index) => ({
                id: poll.options[index]?.id || `opt${index + 1}`,
                label: option.label,
                votes: poll.options[index]?.votes || 0,
              })),
              allowMultipleVotes: data.allowMultipleVotes,
              requireAuthentication: data.requireAuthentication,
            }
          : poll
      );
      
      setActivePolls(updatedPolls);
      
      toast({
        title: "Poll Updated",
        description: "The poll has been successfully updated.",
      });
    } else {
      const newPoll: Poll = {
        id: `P${activePolls.length + 1}`,
        title: data.title,
        description: data.description,
        status: data.status as "draft" | "active" | "ended",
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
        totalVotes: 0,
        options: data.options.map((option, index) => ({
          id: `opt${index + 1}`,
          label: option.label,
          votes: 0,
        })),
        allowMultipleVotes: data.allowMultipleVotes,
        requireAuthentication: data.requireAuthentication,
      };
      
      setActivePolls([newPoll, ...activePolls]);
      
      toast({
        title: "Poll Created",
        description: "The new poll has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const onDeletePoll = () => {
    if (!selectedPoll) return;
    
    const updatedPolls = activePolls.filter(poll => poll.id !== selectedPoll.id);
    setActivePolls(updatedPolls);
    
    toast({
      title: "Poll Deleted",
      description: "The poll has been successfully deleted.",
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedPoll(null);
  };
  
  const onEndPoll = (pollId: string) => {
    const updatedPolls = activePolls.map(poll => 
      poll.id === pollId 
        ? { ...poll, status: "ended" as const }
        : poll
    );
    
    setActivePolls(updatedPolls);
    
    toast({
      title: "Poll Ended",
      description: "The poll has been marked as ended.",
    });
  };
  
  const showResults = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsResultsDialogOpen(true);
  };
  
  const showVoters = (poll: Poll) => {
    const pollWithVoters = {
      ...poll,
      voters: [...mockVoters].sort(() => Math.random() - 0.5).slice(0, poll.totalVotes > 10 ? 10 : poll.totalVotes)
    };
    setSelectedPoll(pollWithVoters);
    setIsVotersDialogOpen(true);
  };
  
  const addOption = () => {
    const currentOptions = form.getValues("options");
    form.setValue("options", [...currentOptions, { label: "" }]);
  };
  
  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options");
    if (currentOptions.length <= 2) {
      toast({
        title: "Cannot Remove Option",
        description: "A poll must have at least two options.",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue(
      "options",
      currentOptions.filter((_, i) => i !== index)
    );
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "ended":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "ended":
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const prepareChartData = (poll: Poll) => {
    return poll.options.map((option, index) => ({
      name: option.label,
      value: option.votes,
      color: COLORS[index % COLORS.length]
    }));
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px' }}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p>{`Votes: ${payload[0].value}`}</p>
          <p>{`Percentage: ${((payload[0].value / selectedPoll?.totalVotes || 0) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Voting Management</CardTitle>
              <CardDescription>
                Create and manage community polls and voting initiatives
              </CardDescription>
            </div>
            <Button onClick={onNewPoll}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Poll
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Input
                  placeholder="Search polls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="ended">Ended</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                <div className="col-span-4">Poll Title</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Start Date</div>
                <div className="col-span-2">End Date</div>
                <div className="col-span-1">Votes</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              {filteredPolls.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No polls found matching your criteria.</p>
                </div>
              ) : (
                filteredPolls.map((poll) => (
                  <div key={poll.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50">
                    <div className="col-span-4 font-medium truncate">{poll.title}</div>
                    <div className="col-span-1">
                      <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(poll.status)}`}>
                        {getStatusIcon(poll.status)}
                        <span className="hidden sm:inline">{poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}</span>
                      </Badge>
                    </div>
                    <div className="col-span-2 text-muted-foreground text-sm">
                      {new Date(poll.startDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 text-muted-foreground text-sm">
                      {new Date(poll.endDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 text-sm font-medium">{poll.totalVotes}</div>
                    <div className="col-span-2 flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => showResults(poll)}
                        title="View Results"
                      >
                        <BarChart2 className="h-4 w-4" />
                        <span className="sr-only">View Results</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => showVoters(poll)}
                        title="View Voters"
                      >
                        <Users className="h-4 w-4" />
                        <span className="sr-only">View Voters</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditPoll(poll)}
                        title="Edit Poll"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      {poll.status === "active" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEndPoll(poll.id)}
                          title="End Poll"
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">End Poll</span>
                        </Button>
                      )}
                      {poll.status !== "active" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPoll(poll);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Delete Poll"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Poll" : "Create New Poll"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of your community poll."
                : "Fill in the details to create a new community poll."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poll Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter poll title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of the poll"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                            onSelect={(date) => date && field.onChange(date)}
                            disabled={(date) =>
                              isBefore(date, new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
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
                            onSelect={(date) => date && field.onChange(date)}
                            disabled={(date) => {
                              const startDate = form.getValues("startDate");
                              return startDate && isBefore(date, startDate);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <FormLabel>Poll Options</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                {form.getValues("options").map((_, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allowMultipleVotes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Multiple Votes</FormLabel>
                        <FormDescription>
                          Users can vote for multiple options
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requireAuthentication"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Require Authentication</FormLabel>
                        <FormDescription>
                          Users must be logged in to vote
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="sticky bottom-0 bg-background pt-4 pb-2 z-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? "Update Poll" : "Create Poll"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this poll? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoll && (
            <div className="border p-3 rounded-md bg-muted/30 my-2">
              <p className="font-medium">{selectedPoll.title}</p>
              <p className="text-sm text-muted-foreground">
                Status: {selectedPoll.status} • Votes: {selectedPoll.totalVotes}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeletePoll}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Poll Results: {selectedPoll?.title}</DialogTitle>
            <DialogDescription>
              Current voting results and statistics
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoll && (
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
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareChartData(selectedPoll)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      nameKey="name"
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={true}
                      paddingAngle={4}
                    >
                      {prepareChartData(selectedPoll).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(value, entry, index) => {
                        const { value: votes } = entry.payload;
                        const percentage = ((votes / selectedPoll.totalVotes) * 100).toFixed(1);
                        return (
                          <span className="text-sm">
                            {value}: {votes} votes ({percentage}%)
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Detailed Results</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-8 gap-4 p-3 bg-muted/30 font-medium text-sm">
                    <div className="col-span-4">Option</div>
                    <div className="col-span-2 text-right">Votes</div>
                    <div className="col-span-2 text-right">Percentage</div>
                  </div>
                  
                  {selectedPoll.options.map((option) => (
                    <div key={option.id} className="grid grid-cols-8 gap-4 p-3 border-t">
                      <div className="col-span-4 font-medium">{option.label}</div>
                      <div className="col-span-2 text-right">{option.votes}</div>
                      <div className="col-span-2 text-right">
                        {selectedPoll.totalVotes > 0
                          ? `${((option.votes / selectedPoll.totalVotes) * 100).toFixed(1)}%`
                          : "0%"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => showVoters(selectedPoll)}>
                  <Users className="h-4 w-4 mr-2" />
                  View Voters
                </Button>
                <Button onClick={() => setIsResultsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isVotersDialogOpen} onOpenChange={setIsVotersDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Voters: {selectedPoll?.title}</DialogTitle>
            <DialogDescription>
              List of people who have participated in this poll
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoll?.voters && selectedPoll.voters.length > 0 ? (
            <div className="space-y-4">
              {selectedPoll.voters.map((voter, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={voter.avatar} alt={voter.name} />
                      <AvatarFallback>{voter.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{voter.name}</span>
                  </div>
                  <Badge variant="outline">
                    {selectedPoll.options.find(o => o.id === voter.vote)?.label.substring(0, 15) || "Unknown"}
                    {(selectedPoll.options.find(o => o.id === voter.vote)?.label.length || 0) > 15 ? "..." : ""}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No voting records available{selectedPoll?.totalVotes ? " (sample data only)" : ""}.</p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsVotersDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVoting;
