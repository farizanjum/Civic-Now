
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VotingProgress from "@/components/voting/VotingProgress";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const totalVotes = supportCount + opposeCount + neutralCount;
  const supportPercentage = totalVotes > 0 ? Math.round((supportCount / totalVotes) * 100) : 0;
  const opposePercentage = totalVotes > 0 ? Math.round((opposeCount / totalVotes) * 100) : 0;
  const neutralPercentage = totalVotes > 0 ? Math.round((neutralCount / totalVotes) * 100) : 0;

  // Check for logged in user and retrieve previous vote
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        const { data: voteData } = await supabase
          .from('votes')
          .select('vote_type')
          .eq('poll_id', id)
          .eq('user_id', data.user.id)
          .single();
        
        if (voteData) {
          setUserVote(voteData.vote_type as "support" | "oppose" | "neutral");
        }
      }
    };
    
    checkUser();
  }, [id]);

  const handleVote = async (vote: "support" | "oppose" | "neutral") => {
    if (userVote === vote) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote on polls.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // If user already voted, update their vote
      if (userVote) {
        // Remove previous vote
        if (userVote === "support") setSupportCount(prev => prev - 1);
        if (userVote === "oppose") setOpposeCount(prev => prev - 1);
        if (userVote === "neutral") setNeutralCount(prev => prev - 1);
        
        // Update vote in database
        await supabase
          .from('votes')
          .update({ vote_type: vote })
          .eq('poll_id', id)
          .eq('user_id', user.id);
      } else {
        // Insert new vote
        await supabase
          .from('votes')
          .insert([
            { 
              poll_id: id, 
              user_id: user.id, 
              vote_type: vote 
            }
          ]);
      }
      
      // Increment vote count
      if (vote === "support") setSupportCount(prev => prev + 1);
      if (vote === "oppose") setOpposeCount(prev => prev + 1);
      if (vote === "neutral") setNeutralCount(prev => prev + 1);
      
      // Update vote count in polls table
      await supabase
        .from('polls')
        .update({
          support_count: vote === "support" ? supportCount + 1 : supportCount - (userVote === "support" ? 1 : 0),
          oppose_count: vote === "oppose" ? opposeCount + 1 : opposeCount - (userVote === "oppose" ? 1 : 0),
          neutral_count: vote === "neutral" ? neutralCount + 1 : neutralCount - (userVote === "neutral" ? 1 : 0),
        })
        .eq('id', id);
      
      setUserVote(vote);
      
      toast({
        title: "Vote Recorded",
        description: `Your vote has been recorded as: ${vote}`,
      });
    } catch (error) {
      console.error("Error recording vote:", error);
      toast({
        title: "Vote Failed",
        description: "There was a problem recording your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          className={userVote === "support" ? "bg-civic-green hover:bg-civic-green-dark" : ""}
        >
          <ThumbsUp size={16} className="mr-1" />
          Support
        </Button>
        <Button
          variant={userVote === "oppose" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("oppose")}
          disabled={isLoading}
          className={userVote === "oppose" ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <ThumbsDown size={16} className="mr-1" />
          Oppose
        </Button>
        <Button
          variant={userVote === "neutral" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("neutral")}
          disabled={isLoading}
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
