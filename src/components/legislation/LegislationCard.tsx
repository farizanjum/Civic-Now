
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, Tag } from "lucide-react";

interface LegislationCardProps {
  id: string;
  title: string;
  summary: string;
  status: "proposed" | "in_review" | "passed" | "rejected";
  date: string;
  category: string;
  neighborhoods: string[];
  commentCount: number;
}

const statusColors = {
  proposed: "bg-amber-100 text-amber-800 border-amber-200",
  in_review: "bg-blue-100 text-blue-800 border-blue-200",
  passed: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const LegislationCard = ({
  id,
  title,
  summary,
  status,
  date,
  category,
  neighborhoods,
  commentCount,
}: LegislationCardProps) => {
  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`${statusColors[status]} capitalize`}>
            {status.replace('_', ' ')}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Tag size={12} /> {category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">
          Published on {date}
          {neighborhoods.length > 0 && (
            <span> • Affects: {neighborhoods.join(', ')}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-civic-gray-dark">{summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center text-sm text-civic-gray">
          <MessageSquare size={16} className="mr-1" /> 
          <span>{commentCount} comments</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye size={16} />
            <span>View</span>
          </Button>
          <Button size="sm" className="bg-civic-blue hover:bg-civic-blue-dark">
            <MessageSquare size={16} className="mr-1" />
            <span>Feedback</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LegislationCard;
