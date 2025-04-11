
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VotingProgress from "@/components/voting/VotingProgress";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VotingPollProps {
  id: string;
  title: string;
  description: string;
  endDate: string;
  category: string;
  supportCount: number;
  opposeCount: number;
  neutralCount: number;
  isVoted?: boolean;
}

const VotingPoll = ({
  id,
  title,
  description,
  endDate,
  category,
  supportCount: initialSupportCount,
  opposeCount: initialOpposeCount,
  neutralCount: initialNeutralCount,
  isVoted = false,
}: VotingPollProps) => {
  const [userVote, setUserVote] = useState<"support" | "oppose" | "neutral" | null>(null);
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [opposeCount, setOpposeCount] = useState(initialOpposeCount);
  const [neutralCount, setNeutralCount] = useState(initialNeutralCount);

  const totalVotes = supportCount + opposeCount + neutralCount;
  const supportPercentage = totalVotes > 0 ? Math.round((supportCount / totalVotes) * 100) : 0;
  const opposePercentage = totalVotes > 0 ? Math.round((opposeCount / totalVotes) * 100) : 0;
  const neutralPercentage = totalVotes > 0 ? Math.round((neutralCount / totalVotes) * 100) : 0;

  const handleVote = (vote: "support" | "oppose" | "neutral") => {
    if (userVote === vote) return;

    // Remove previous vote if exists
    if (userVote === "support") setSupportCount(prev => prev - 1);
    if (userVote === "oppose") setOpposeCount(prev => prev - 1);
    if (userVote === "neutral") setNeutralCount(prev => prev - 1);

    // Add new vote
    if (vote === "support") setSupportCount(prev => prev + 1);
    if (vote === "oppose") setOpposeCount(prev => prev + 1);
    if (vote === "neutral") setNeutralCount(prev => prev + 1);

    setUserVote(vote);
    toast({
      title: "Vote Recorded",
      description: `Your vote has been recorded as: ${vote}`,
    });
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
          <Badge variant="outline">
            Ends {endDate}
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">
          {totalVotes} votes so far
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-civic-gray-dark mb-4">{description}</p>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <ThumbsUp size={16} className="text-civic-green mr-2" /> Support
              </span>
              <span>{supportPercentage}%</span>
            </div>
            <VotingProgress value={supportPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-civic-green" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <ThumbsDown size={16} className="text-red-500 mr-2" /> Oppose
              </span>
              <span>{opposePercentage}%</span>
            </div>
            <VotingProgress value={opposePercentage} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Star size={16} className="text-amber-500 mr-2" /> Neutral
              </span>
              <span>{neutralPercentage}%</span>
            </div>
            <VotingProgress value={neutralPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-amber-400" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant={userVote === "support" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("support")}
          className={userVote === "support" ? "bg-civic-green hover:bg-civic-green-dark" : ""}
        >
          <ThumbsUp size={16} className="mr-1" />
          Support
        </Button>
        <Button
          variant={userVote === "oppose" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("oppose")}
          className={userVote === "oppose" ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <ThumbsDown size={16} className="mr-1" />
          Oppose
        </Button>
        <Button
          variant={userVote === "neutral" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("neutral")}
          className={userVote === "neutral" ? "bg-amber-500 hover:bg-amber-600" : ""}
        >
          <Star size={16} className="mr-1" />
          Neutral
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VotingPoll;
