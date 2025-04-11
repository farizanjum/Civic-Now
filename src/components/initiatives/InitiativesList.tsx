
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, Users, Calendar, ThumbsUp, MessageSquare, Search, Filter, MapPin } from "lucide-react";

// Mock data for initiatives
const mockInitiatives = [
  {
    id: 1,
    title: "Community Garden Project",
    description: "Create a shared garden space for growing vegetables and flowers, promoting sustainable living and community engagement.",
    category: "Environment",
    location: "Westside Park",
    supporters: 142,
    comments: 37,
    status: "Active",
    date: "2025-02-15",
    author: {
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg",
    },
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Youth Coding Workshop",
    description: "Weekly coding classes for children ages 10-16 to learn programming basics and develop tech skills for the future.",
    category: "Education",
    location: "Community Center",
    supporters: 89,
    comments: 23,
    status: "Planning",
    date: "2025-03-01",
    author: {
      name: "James Chen",
      avatar: "/placeholder.svg",
    },
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Street Safety Improvements",
    description: "Proposal to add speed bumps, pedestrian crossings, and better lighting on Oak Avenue to improve safety for residents.",
    category: "Infrastructure",
    location: "Oak Avenue",
    supporters: 215,
    comments: 54,
    status: "Under Review",
    date: "2025-01-28",
    author: {
      name: "David Wilson",
      avatar: "/placeholder.svg",
    },
    image: "/placeholder.svg",
  },
];

const InitiativesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all_categories");

  // Filter initiatives based on search term and category
  const filteredInitiatives = mockInitiatives.filter(
    (initiative) =>
      initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all_categories" || initiative.category === categoryFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Planning":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="search-initiatives" className="text-sm font-medium mb-2 block">
            Search Initiatives
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-initiatives"
              placeholder="Search by title or keyword"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <label htmlFor="category-filter" className="text-sm font-medium mb-2 block">
            Filter by Category
          </label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter" className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">All Categories</SelectItem>
              <SelectItem value="Environment">Environment</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Safety">Safety</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Culture">Culture</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredInitiatives.length === 0 && (
        <div className="text-center py-10">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-medium mb-1">No initiatives found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter terms, or submit a new initiative.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInitiatives.map((initiative) => (
          <Card key={initiative.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="h-48 overflow-hidden">
              <img
                src={initiative.image}
                alt={initiative.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className={getStatusColor(initiative.status)}>{initiative.status}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin size={12} />
                  {initiative.location}
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">{initiative.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                <span>Posted on {new Date(initiative.date).toLocaleDateString()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {initiative.description}
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={initiative.author.avatar} alt={initiative.author.name} />
                  <AvatarFallback>{initiative.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{initiative.author.name}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-civic-blue" />
                  <span className="text-xs">{initiative.supporters}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-civic-gray-dark" />
                  <span className="text-xs">{initiative.comments}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InitiativesList;
