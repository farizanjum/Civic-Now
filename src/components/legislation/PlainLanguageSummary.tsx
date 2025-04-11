
import React from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface LegislationSummaryProps {
  title: string;
  originalText: string;
  plainSummary: string;
  impacts: {
    positive: string[];
    negative: string[];
    uncertain: string[];
  };
  status: "proposed" | "in_review" | "passed" | "rejected";
  date: string;
  category: string;
}

const PlainLanguageSummary: React.FC<LegislationSummaryProps> = ({
  title,
  originalText,
  plainSummary,
  impacts,
  status,
  date,
  category
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-civic-blue/5 pb-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl font-bold text-civic-blue flex items-center">
            <BookOpen className="mr-2 h-5 w-5" /> 
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`
                ${status === 'proposed' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}
                ${status === 'in_review' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                ${status === 'passed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                ${status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
              `}
            >
              {status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">{category}</Badge>
          </div>
        </div>
        <CardDescription>Proposed on {date}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-civic-blue text-white p-1 rounded-full mr-2 text-xs">TL;DR</span>
            Plain Language Summary
          </h3>
          <p className="text-gray-700 text-base bg-amber-50 p-4 rounded-md border border-amber-100">
            {plainSummary}
          </p>
        </div>
        
        <Separator className="my-6" />
        
        {/* Impact Assessment */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Potential Impacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <h4 className="font-medium text-green-800 flex items-center mb-2">
                <ThumbsUp className="h-4 w-4 mr-1" /> Positive Impacts
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {impacts.positive.map((impact, index) => (
                  <li key={index}>{impact}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md border border-red-100">
              <h4 className="font-medium text-red-800 flex items-center mb-2">
                <ThumbsDown className="h-4 w-4 mr-1" /> Potential Concerns
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {impacts.negative.map((impact, index) => (
                  <li key={index}>{impact}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800 flex items-center mb-2">
                <HelpCircle className="h-4 w-4 mr-1" /> Uncertain Effects
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {impacts.uncertain.map((impact, index) => (
                  <li key={index}>{impact}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Original Text */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="text-xs">Original Legislative Text</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">This is the official text of the legislation as proposed.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm max-h-60 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-line">{originalText}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-civic-blue/5 flex justify-between">
        <Button variant="outline" size="sm">
          Share
        </Button>
        <Button variant="default" size="sm">
          Provide Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlainLanguageSummary;
