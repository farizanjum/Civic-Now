
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, MessageSquare } from "lucide-react";

interface LegislationCardProps {
  id: string;
  title: string;
  summary: string;
  status: "proposed" | "in_review" | "passed" | "rejected";
  date: string;
  category: string;
  neighborhoods: string[];
  commentCount: number;
  onFeedbackClick?: (id: string) => void;
}

const LegislationCard = ({
  id,
  title,
  summary,
  status,
  date,
  category,
  neighborhoods,
  commentCount,
  onFeedbackClick
}: LegislationCardProps) => {
  // Map status to color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposed":
        return "bg-yellow-100 text-yellow-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      case "passed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between gap-2 mb-2">
          <Badge variant="secondary">{category}</Badge>
          <Badge className={getStatusColor(status)}>{formatStatus(status)}</Badge>
        </div>
        <CardTitle className="text-lg font-bold hover:text-civic-blue transition-colors">
          <Link to={`/legislation/${id}`}>{title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{summary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="h-3 w-3 mr-1" />
            {date}
          </div>
          {neighborhoods.length > 0 && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {neighborhoods.length > 1
                ? `${neighborhoods[0]} +${neighborhoods.length - 1}`
                : neighborhoods[0]}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link to={`/legislation/${id}`}>View Details</Link>
        </Button>
        <Button
          size="sm"
          onClick={onFeedbackClick ? () => onFeedbackClick(id) : undefined}
          asChild={!onFeedbackClick}
        >
          {onFeedbackClick ? (
            <>
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Feedback
            </>
          ) : (
            <Link to={`/legislation/${id}?tab=discussion`}>
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Feedback
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LegislationCard;
