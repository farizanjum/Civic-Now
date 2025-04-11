
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { format, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, FileText, BarChart2, Users } from "lucide-react";

// Mock data for active polls
const activePolls = [
  {
    id: "P1",
    title: "Community Center Improvement",
    status: "Active",
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
    status: "Active",
    startDate: "2025-03-10",
    endDate: "2025-04-10",
    totalVotes: 189,
    options: [
      { id: "opt1", label: "Playground equipment", votes: 72 },
      { id: "opt2", label: "Walking trails", votes: 95 },
      { id: "opt3", label: "Sports courts", votes: 22 },
    ]
  },
  {
    id: "P3",
    title: "Community Events Priority",
    status: "Ended",
    startDate: "2025-02-01",
    endDate: "2025-03-01",
    totalVotes: 432,
    options: [
      { id: "opt1", label: "Cultural festivals", votes: 187 },
      { id: "opt2", label: "Educational workshops", votes: 98 },
      { id: "opt3", label: "Family activities", votes: 147 },
    ]
  }
];

// Form schema for creating a new vote
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be less than 100 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(500, "Description must be less than 500 characters."),
  options: z.array(z.string()).min(2, "At least 2 options are required."),
  startDate: z.date(),
  endDate: z.date(),
  eligibility: z.string(),
  isPublicResults: z.boolean(),
});

const AdminVoting = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [options, setOptions] = useState<string[]>(["", ""]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      options: ["", ""],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 2 weeks
      eligibility: "all",
      isPublicResults: true,
    },
  });
  
  const addOption = () => {
    setOptions([...options, ""]);
    const currentOptions = form.getValues("options");
    form.setValue("options", [...currentOptions, ""]);
  };
  
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast({
        title: "Error",
        description: "At least 2 options are required.",
        variant: "destructive",
      });
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    const currentOptions = form.getValues("options");
    const newFormOptions = [...currentOptions];
    newFormOptions.splice(index, 1);
    form.setValue("options", newFormOptions);
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Filter out empty options
    const filteredOptions = values.options.filter(opt => opt.trim() !== "");
    
    if (filteredOptions.length < 2) {
      toast({
        title: "Error",
        description: "At least 2 non-empty options are required.",
        variant: "destructive",
      });
      return;
    }
    
    if (isBefore(values.endDate, values.startDate)) {
      toast({
        title: "Error",
        description: "End date cannot be before start date.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Form values:", {...values, options: filteredOptions});
    
    toast({
      title: "Poll Created",
      description: "Your community vote has been created successfully.",
    });
    
    form.reset();
    setOptions(["", ""]);
  };
  
  // Calculate colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="active">Active Polls</TabsTrigger>
          <TabsTrigger value="create">Create New Poll</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activePolls.map((poll) => (
            <Card key={poll.id} className={poll.status === "Ended" ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{poll.title}</CardTitle>
                  <Badge className={poll.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {poll.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span>
                    {new Date(poll.startDate).toLocaleDateString()} - {new Date(poll.endDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {poll.totalVotes} votes
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {poll.options.map((option) => (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{option.label}</span>
                          <span className="font-medium">{Math.round((option.votes / poll.totalVotes) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${(option.votes / poll.totalVotes) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center items-center">
                    <div className="h-48 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={poll.options}
                            dataKey="votes"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            fill="#8884d8"
                            label={({ name, percent }) => `${name.substring(0, 12)}${name.length > 12 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {poll.options.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1">Edit Poll</Button>
                  {poll.status === "Active" ? (
                    <Button variant="outline" className="flex-1">End Poll</Button>
                  ) : (
                    <Button variant="outline" className="flex-1">Archive</Button>
                  )}
                  <Button variant="outline" className="flex-1">Full Results</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Community Vote</CardTitle>
              <CardDescription>Set up a new poll for community input</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poll Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title for your poll" {...field} />
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
                            placeholder="Describe the purpose of this poll and what voters should consider" 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Poll Options</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addOption} className="h-8">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    
                    {options.map((_, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <FormField
                          control={form.control}
                          name={`options.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Option ${index + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 px-3 text-muted-foreground"
                          onClick={() => removeOption(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                onSelect={field.onChange}
                                disabled={(date) => isBefore(date, new Date())}
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
                                onSelect={field.onChange}
                                disabled={(date) => 
                                  isBefore(date, new Date()) || 
                                  (form.getValues("startDate") && isBefore(date, form.getValues("startDate")))
                                }
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
                    name="eligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voter Eligibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Who can vote?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All registered users</SelectItem>
                            <SelectItem value="verified">Verified residents only</SelectItem>
                            <SelectItem value="invited">Invited participants only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPublicResults"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Show live results to voters
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => form.reset()}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Poll</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Active Polls</p>
                  <p className="text-3xl font-bold">2</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Votes Cast</p>
                  <p className="text-3xl font-bold">877</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Average Participation Rate</p>
                  <p className="text-3xl font-bold">24.6%</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Voting Analytics</CardTitle>
              <CardDescription>Comprehensive data on community voting patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Detailed analytics to be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVoting;
