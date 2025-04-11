
import Layout from "@/components/layout/Layout";
import LegislationCard from "@/components/legislation/LegislationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Sample legislation data with Indian context
const legislationData = [
  {
    id: "leg-001",
    title: "Green Space Development Plan for Delhi NCR",
    summary: "A proposal to increase public parks and green spaces in Delhi NCR residential neighborhoods by 15% over the next three years.",
    status: "in_review",
    date: "April 5, 2023",
    category: "Environment",
    neighborhoods: ["South Delhi", "Noida"],
    commentCount: 24,
  },
  {
    id: "leg-002",
    title: "Metro Rail Expansion Project",
    summary: "Extension of metro routes to underserved neighborhoods in Mumbai and increased frequency during peak hours.",
    status: "proposed",
    date: "April 2, 2023",
    category: "Transportation",
    neighborhoods: ["Andheri", "Bandra", "Dadar"],
    commentCount: 42,
  },
  {
    id: "leg-003",
    title: "Affordable Housing Initiative for Bengaluru",
    summary: "Plan to develop 200 affordable housing units in partnership with local developers in Bengaluru, with rent control measures for 10 years.",
    status: "proposed",
    date: "March 28, 2023",
    category: "Housing",
    neighborhoods: ["Whitefield", "Electronic City"],
    commentCount: 57,
  },
  {
    id: "leg-004",
    title: "MSME Grant Program",
    summary: "Creation of a ₹20 crore fund to provide grants to small businesses affected by recent economic challenges in Chennai.",
    status: "passed",
    date: "March 20, 2023",
    category: "Economic Development",
    neighborhoods: ["T. Nagar", "Mylapore", "Anna Nagar"],
    commentCount: 34,
  },
  {
    id: "leg-005",
    title: "Road Infrastructure Improvement in Hyderabad",
    summary: "Comprehensive plan to repair roads, bridges and footpaths across Hyderabad over the next fiscal year.",
    status: "in_review",
    date: "March 15, 2023",
    category: "Infrastructure",
    neighborhoods: ["Citywide"],
    commentCount: 19,
  },
  {
    id: "leg-006",
    title: "Mid-day Meal Program Enhancement",
    summary: "Expansion of the mid-day meal program to provide nutritious breakfast and lunch options to all public school students in Kolkata.",
    status: "passed",
    date: "March 10, 2023",
    category: "Education",
    neighborhoods: ["Citywide"],
    commentCount: 67,
  },
];

// Define the types for filter state
type Status = "proposed" | "in_review" | "passed" | "rejected" | "all";
type Category = "Environment" | "Transportation" | "Housing" | "Economic Development" | "Infrastructure" | "Education" | "all";
type Neighborhood = "South Delhi" | "Noida" | "Andheri" | "Bandra" | "Dadar" | "Whitefield" | "Electronic City" | "T. Nagar" | "Mylapore" | "Anna Nagar" | "Citywide" | "all";

const Legislation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<Neighborhood>("all");

  // Filter legislation based on selected filters
  const filteredLegislation = legislationData.filter((item) => {
    return (
      (searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || item.status === statusFilter) &&
      (categoryFilter === "all" || item.category === categoryFilter) &&
      (neighborhoodFilter === "all" || item.neighborhoods.includes(neighborhoodFilter))
    );
  });

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all" || neighborhoodFilter !== "all" || searchTerm !== "";

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setNeighborhoodFilter("all");
  };

  return (
    <Layout>
      <div className="bg-civic-blue/10 py-10">
        <div className="civic-container">
          <h1 className="text-3xl md:text-4xl font-bold text-civic-blue mb-2">Legislation Center</h1>
          <p className="text-lg text-civic-gray-dark mb-6">
            Browse, search and provide feedback on proposed and active legislation in your community across India.
          </p>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search legislation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-4">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="proposed">Proposed</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Economic Development">Economic Development</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={neighborhoodFilter} onValueChange={(value) => setNeighborhoodFilter(value as Neighborhood)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="South Delhi">South Delhi</SelectItem>
                    <SelectItem value="Noida">Noida</SelectItem>
                    <SelectItem value="Andheri">Andheri</SelectItem>
                    <SelectItem value="Bandra">Bandra</SelectItem>
                    <SelectItem value="Dadar">Dadar</SelectItem>
                    <SelectItem value="Whitefield">Whitefield</SelectItem>
                    <SelectItem value="Electronic City">Electronic City</SelectItem>
                    <SelectItem value="T. Nagar">T. Nagar</SelectItem>
                    <SelectItem value="Mylapore">Mylapore</SelectItem>
                    <SelectItem value="Anna Nagar">Anna Nagar</SelectItem>
                    <SelectItem value="Citywide">Citywide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="text-sm text-civic-gray-dark font-medium flex items-center">
                  <SlidersHorizontal size={14} className="mr-1" /> Active Filters:
                </div>
                
                {searchTerm && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X size={14} className="ml-1 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                
                {statusFilter !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Status: {statusFilter.replace('_', ' ')}
                    <X size={14} className="ml-1 cursor-pointer" onClick={() => setStatusFilter("all")} />
                  </Badge>
                )}
                
                {categoryFilter !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Category: {categoryFilter}
                    <X size={14} className="ml-1 cursor-pointer" onClick={() => setCategoryFilter("all")} />
                  </Badge>
                )}
                
                {neighborhoodFilter !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Location: {neighborhoodFilter}
                    <X size={14} className="ml-1 cursor-pointer" onClick={() => setNeighborhoodFilter("all")} />
                  </Badge>
                )}
                
                <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-civic-gray-dark">
              Showing <span className="font-medium">{filteredLegislation.length}</span> of <span className="font-medium">{legislationData.length}</span> legislation items
            </p>
          </div>

          {/* Legislation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLegislation.length > 0 ? (
              filteredLegislation.map((item) => (
                <LegislationCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  summary={item.summary}
                  status={item.status as "proposed" | "in_review" | "passed" | "rejected"}
                  date={item.date}
                  category={item.category}
                  neighborhoods={item.neighborhoods}
                  commentCount={item.commentCount}
                />
              ))
            ) : (
              <div className="col-span-2 py-16 text-center">
                <p className="text-xl text-civic-gray-dark mb-4">No legislation found matching your criteria.</p>
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Legislation;
