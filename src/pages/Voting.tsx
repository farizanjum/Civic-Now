
import Layout from "@/components/layout/Layout";
import VotingPoll from "@/components/voting/VotingPoll";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

// Sample voting polls data
const pollsData = [
  {
    id: "poll-001",
    title: "New Community Center Location",
    description: "Where should the new community center be built? This facility will include meeting spaces, recreational areas, and public services.",
    endDate: "May 15, 2023",
    category: "Infrastructure",
    supportCount: 156,
    opposeCount: 43,
    neutralCount: 27,
  },
  {
    id: "poll-002",
    title: "Weekend Farmers Market Proposal",
    description: "Should we establish a weekly farmers market in the central plaza on weekends to promote local businesses and fresh produce?",
    endDate: "May 10, 2023",
    category: "Economic Development",
    supportCount: 203,
    opposeCount: 18,
    neutralCount: 12,
  },
  {
    id: "poll-003",
    title: "Extended Library Hours",
    description: "Should the public library extend its hours to include Sunday afternoons and weekday evenings until 9pm?",
    endDate: "May 20, 2023",
    category: "Education",
    supportCount: 178,
    opposeCount: 45,
    neutralCount: 32,
  },
  {
    id: "poll-004",
    title: "Bike Lane Expansion Project",
    description: "Do you support the proposal to expand dedicated bike lanes on major roads throughout the downtown area?",
    endDate: "May 25, 2023",
    category: "Transportation",
    supportCount: 135,
    opposeCount: 87,
    neutralCount: 29,
  },
  {
    id: "poll-005",
    title: "Annual Arts Festival Budget",
    description: "Should the city allocate additional funding to expand the annual summer arts festival to a two-weekend event?",
    endDate: "June 5, 2023",
    category: "Culture",
    supportCount: 98,
    opposeCount: 62,
    neutralCount: 45,
  },
  {
    id: "poll-006",
    title: "Community Garden Initiative",
    description: "Do you support converting vacant lots in the Riverside neighborhood into community gardens maintained by local residents?",
    endDate: "June 10, 2023",
    category: "Environment",
    supportCount: 187,
    opposeCount: 23,
    neutralCount: 14,
  },
];

type Category = "Infrastructure" | "Economic Development" | "Education" | "Transportation" | "Culture" | "Environment" | "all";
type SortOption = "newest" | "endingSoon" | "mostVotes";

const Voting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Filter and sort polls based on user selections
  const filteredPolls = pollsData
    .filter((poll) => {
      return (
        (searchTerm === "" || 
          poll.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          poll.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === "all" || poll.category === categoryFilter)
      );
    })
    .sort((a, b) => {
      if (sortOption === "endingSoon") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      } else if (sortOption === "mostVotes") {
        const totalVotesA = a.supportCount + a.opposeCount + a.neutralCount;
        const totalVotesB = b.supportCount + b.opposeCount + b.neutralCount;
        return totalVotesB - totalVotesA;
      } else {
        // Default to newest
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }
    });

  return (
    <Layout>
      <div className="bg-civic-blue/10 py-10">
        <div className="civic-container">
          <h1 className="text-3xl md:text-4xl font-bold text-civic-blue mb-2">Community Voting</h1>
          <p className="text-lg text-civic-gray-dark mb-6">
            Participate in polls on important local issues and see how your community is voting.
          </p>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search polls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-4">
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Economic Development">Economic Development</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Culture">Culture</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="endingSoon">Ending Soon</SelectItem>
                    <SelectItem value="mostVotes">Most Votes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-civic-gray-dark">
              Showing <span className="font-medium">{filteredPolls.length}</span> of <span className="font-medium">{pollsData.length}</span> active polls
            </p>
          </div>

          {/* Voting Poll Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => (
                <VotingPoll
                  key={poll.id}
                  id={poll.id}
                  title={poll.title}
                  description={poll.description}
                  endDate={poll.endDate}
                  category={poll.category}
                  supportCount={poll.supportCount}
                  opposeCount={poll.opposeCount}
                  neutralCount={poll.neutralCount}
                />
              ))
            ) : (
              <div className="col-span-2 py-16 text-center">
                <p className="text-xl text-civic-gray-dark mb-4">No polls found matching your criteria.</p>
                <Button variant="outline" onClick={() => { setSearchTerm(""); setCategoryFilter("all"); }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Voting;
