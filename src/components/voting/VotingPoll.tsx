
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VotingProgress from "@/components/voting/VotingProgress";

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
  opposeCount: initialOposeCount,
  neutralCount: initialNeutralCount,
  isVoted = false,
}: VotingPollProps) => {
  const [userVote, setUserVote] = useState<"support" | "oppose" | "neutral" | null>(null);
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [opposeCount, setOppostCount] = useState(initialOposeCount);
  const [neutralCount, setNeutralCount] = useState(initialNeutralCount);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Calculate total and percentages
  const totalVotes = supportCount + opposeCount + neutralCount;
  const supportPercentage = totalVotes > 0 ? Math.round((supportCount / totalVotes) * 100) : 0;
  const opposePercentage = totalVotes > 0 ? Math.round((opposeCount / totalVotes) * 100) : 0;
  const neutralPercentage = totalVotes > 0 ? Math.round((neutralCount / totalVotes) * 100) : 0;

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        
        // Check if user has already voted on this poll
        if (data.session.user) {
          const { data: voteData } = await supabase
            .from('votes')
            .select('vote_type')
            .eq('poll_id', id)
            .eq('user_id', data.session.user.id)
            .single();
          
          if (voteData) {
            setUserVote(voteData.vote_type as "support" | "oppose" | "neutral");
          }
        }
      }
    };
    
    checkUser();
  }, [id]);

  const handleVote = async (vote: "support" | "oppose" | "neutral") => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote on polls.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let supportDelta = 0;
      let opposeDelta = 0;
      let neutralDelta = 0;
      
      // Calculate how counts should change
      if (userVote) {
        // User is changing their vote
        if (userVote === 'support') supportDelta--;
        else if (userVote === 'oppose') opposeDelta--;
        else if (userVote === 'neutral') neutralDelta--;
      }
      
      if (vote === 'support') supportDelta++;
      else if (vote === 'oppose') opposeDelta++;
      else if (vote === 'neutral') neutralDelta++;
      
      // Update the vote in the database
      if (userVote) {
        // Update existing vote
        await supabase
          .from('votes')
          .update({ vote_type: vote })
          .eq('poll_id', id)
          .eq('user_id', user.id);
      } else {
        // Insert new vote
        await supabase
          .from('votes')
          .insert({
            poll_id: id,
            user_id: user.id,
            vote_type: vote
          });
      }
      
      // Update poll counts
      await supabase
        .from('polls')
        .update({
          support_count: supportCount + supportDelta,
          oppose_count: opposeCount + opposeDelta,
          neutral_count: neutralCount + neutralDelta
        })
        .eq('id', id);
      
      // Update local state
      setSupportCount(prev => prev + supportDelta);
      setOppostCount(prev => prev + opposeDelta);
      setNeutralCount(prev => prev + neutralDelta);
      setUserVote(vote);
      
      toast({
        title: "Vote Recorded",
        description: `Your vote has been recorded as: ${vote}`,
      });
    } catch (error) {
      console.error("Error recording vote:", error);
      toast({
        title: "Error",
        description: "There was a problem recording your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{title}</h3>
          <Badge>{category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
              <span>Support</span>
            </div>
            <span className="text-sm font-medium">{supportPercentage}%</span>
          </div>
          <VotingProgress
            value={supportPercentage}
            className={userVote === "support" ? "bg-green-100" : "bg-muted"}
            indicatorClassName="bg-green-500"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
              <span>Oppose</span>
            </div>
            <span className="text-sm font-medium">{opposePercentage}%</span>
          </div>
          <VotingProgress
            value={opposePercentage}
            className={userVote === "oppose" ? "bg-red-100" : "bg-muted"}
            indicatorClassName="bg-red-500"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-amber-500" />
              <span>Neutral</span>
            </div>
            <span className="text-sm font-medium">{neutralPercentage}%</span>
          </div>
          <VotingProgress
            value={neutralPercentage}
            className={userVote === "neutral" ? "bg-amber-100" : "bg-muted"}
            indicatorClassName="bg-amber-500"
          />
        </div>
      </div>
      
      <div className="p-4 border-t bg-muted/20 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>
            Total Votes: {totalVotes} · Ends: {new Date(endDate).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button 
              variant={userVote === "support" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("support")}
              disabled={isLoading}
              className={userVote === "support" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              Support
            </Button>
            <Button
              variant={userVote === "oppose" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("oppose")}
              disabled={isLoading}
              className={userVote === "oppose" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <ThumbsDown className="h-3.5 w-3.5 mr-1" />
              Oppose
            </Button>
            <Button
              variant={userVote === "neutral" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("neutral")}
              disabled={isLoading}
              className={userVote === "neutral" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              Neutral
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPoll;
