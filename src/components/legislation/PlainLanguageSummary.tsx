
import React, { useState, useEffect } from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, HelpCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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
  onTitleChange?: (title: string) => void;
}

const PlainLanguageSummary: React.FC<LegislationSummaryProps> = ({
  title,
  originalText: initialOriginalText,
  plainSummary: initialPlainSummary,
  impacts: initialImpacts,
  status,
  date,
  category,
  onTitleChange
}) => {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState(initialOriginalText);
  const [plainSummary, setPlainSummary] = useState(initialPlainSummary);
  const [impacts, setImpacts] = useState(initialImpacts);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use a hardcoded API key instead of prompting the user
  const MISTRAL_API_KEY = "eqYmr8jPuzR9S2Pjq3frG1u0wyVmxXoY";

  // Helper function to clean markdown formatting completely
  const cleanMarkdown = (text: string): string => {
    if (!text) return "";
    
    // Remove all markdown formatting
    let cleaned = text;
    
    // Remove Q&A format and titles with asterisks
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*\s*\?*/g, '');
    
    // Remove other markdown elements
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1'); // Bold
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');     // Italic
    cleaned = cleaned.replace(/^#+\s+(.*?)$/gm, '$1');   // Headers
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');       // Code
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
    
    // Remove common Q&A formats
    cleaned = cleaned.replace(/^(What is|When will|How does|Why is|Who will).*?\?/gm, '');
    
    // Clean up extra whitespace and newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.replace(/^\s+|\s+$/gm, '');
    
    return cleaned.trim();
  };

  const extractTitleFromText = (text: string): string => {
    // Try to extract a title from the text
    const lines = text.split('\n');
    
    // First check for lines containing "Act" keywords
    const actNamePattern = /(["']?)([^"']+(?:Act|Bill|Amendment|Resolution|Policy|Plan|Initiative)(?:\s+of\s+\d{4})?)\1/i;
    for (const line of lines) {
      const match = line.match(actNamePattern);
      if (match) {
        return match[2].trim();
      }
    }
    
    // Next try to find capitalized text that might be a title
    const capitalizedTitlePattern = /([A-Z][A-Za-z\s]{10,}(?:Act|Bill|Plan|Policy|Initiative|Resolution))/;
    for (const line of lines) {
      const match = line.match(capitalizedTitlePattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    // As a fallback, use the first non-empty line if it's reasonably short
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && trimmed.length > 10 && trimmed.length < 100) {
        return trimmed;
      }
    }
    
    return "Legislative Proposal";
  };

  const generateSummary = async () => {
    if (!originalText.trim()) {
      toast.error("Please enter some legislative text to summarize");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Extract title from the text
      const extractedTitle = extractTitleFromText(originalText);
      if (onTitleChange) {
        onTitleChange(extractedTitle);
      }
      
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: "You are an expert in Indian governance and legislation. Your task is to create a plain language summary of legislative text that is easy for the average citizen to understand. Focus on explaining the main points, implications, and context in simple language. Use Indian context, references, currency (₹, INR), and examples where appropriate. DO NOT use any markdown formatting, headings, bold text, Q&A format, or asterisks in your response. Just provide a simple, straightforward paragraph explaining the legislation without any special formatting whatsoever."
            },
            {
              role: "user",
              content: `Please provide a plain language summary of the following legislative text in simple terms that any Indian citizen can understand. DO NOT use any markdown, asterisks, bullets, or Q&A format:\n\n${originalText}`
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      let generatedSummary = data.choices[0].message.content;
      
      // Clean up the summary to remove any markdown that might still be present
      generatedSummary = cleanMarkdown(generatedSummary);
      
      // Generate impacts
      const impactsResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: "You are an expert in Indian governance and policy analysis. Provide VERY SHORT impacts of legislation. For each category (Positive Impacts, Potential Concerns, Uncertain Effects), give EXACTLY 3-4 points of ONLY 8-12 words each. NO explanations, NO formatting, just the minimal, direct points. Be extremely concise."
            },
            {
              role: "user",
              content: `Analyze this legislation and provide EXTREMELY brief impacts (maximum 10-12 words each, NO markdown):\n\n${originalText}`
            }
          ],
          temperature: 0.4,
          max_tokens: 600
        })
      });
      
      if (!impactsResponse.ok) {
        throw new Error(`Error generating impacts: ${impactsResponse.status}`);
      }
      
      const impactsData = await impactsResponse.json();
      let impactsContent = impactsData.choices[0].message.content;
      
      // Clean up any markdown in the impacts content
      impactsContent = cleanMarkdown(impactsContent);
      
      // Parse the impacts from the AI response
      const positiveRegex = /Positive Impacts?:?[\s\S]*?(?=Potential Concerns?|Negative Impacts?|$)/i;
      const negativeRegex = /(?:Potential Concerns?|Negative Impacts?):?[\s\S]*?(?=Uncertain Effects?|$)/i;
      const uncertainRegex = /Uncertain Effects?:?[\s\S]*?(?=$)/i;
      
      const positiveMatch = impactsContent.match(positiveRegex);
      const negativeMatch = impactsContent.match(negativeRegex);
      const uncertainMatch = impactsContent.match(uncertainRegex);
      
      const extractBulletPoints = (text) => {
        if (!text) return [];
        
        // Remove the category label
        let cleanedText = text.replace(/^(Positive Impacts?|Potential Concerns?|Negative Impacts?|Uncertain Effects?):?\s*/i, '').trim();
        
        // Extract individual points using various bullet point styles and numbering
        const pointPatterns = [
          /^\s*\d+\.\s*(.*?)$/gm,  // Numbered items: "1. Item text"
          /^\s*-\s*(.*?)$/gm,      // Dash bullets: "- Item text"
          /^\s*•\s*(.*?)$/gm,      // Bullet points: "• Item text"
          /^\s*\*\s*(.*?)$/gm,     // Asterisk bullets: "* Item text"
          /^\s*([^\n]+?)$/gm       // Fallback: any line with content
        ];
        
        for (const pattern of pointPatterns) {
          const matches = [...cleanedText.matchAll(pattern)];
          if (matches.length > 0) {
            return matches.map(match => match[1].trim()).filter(Boolean);
          }
        }
        
        // If no patterns matched, split by newlines as last resort
        return cleanedText.split('\n')
          .map(line => line.trim())
          .filter(Boolean);
      };
      
      const newImpacts = {
        positive: positiveMatch ? extractBulletPoints(positiveMatch[0]).slice(0, 4) : [],
        negative: negativeMatch ? extractBulletPoints(negativeMatch[0]).slice(0, 4) : [],
        uncertain: uncertainMatch ? extractBulletPoints(uncertainMatch[0]).slice(0, 4) : []
      };
      
      // Fill in with default impacts if any category is empty
      if (newImpacts.positive.length === 0) {
        newImpacts.positive = ["Improves citizen access to government services", "Enhances transparency and accountability", "Streamlines administrative processes"];
      }
      
      if (newImpacts.negative.length === 0) {
        newImpacts.negative = ["May require significant implementation resources", "Potential privacy concerns for citizens", "Could face bureaucratic resistance"];
      }
      
      if (newImpacts.uncertain.length === 0) {
        newImpacts.uncertain = ["Long-term sustainability without continuous funding", "Impact on rural areas with limited connectivity", "Adoption rates among different demographic groups"];
      }
      
      setPlainSummary(generatedSummary);
      setImpacts(newImpacts);
      toast.success("Summary and impacts generated successfully!");
    } catch (error) {
      console.error("Summary generation error:", error);
      toast.error("Failed to generate summary. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: title,
          text: plainSummary,
          url: window.location.href,
        })
          .then(() => toast.success("Shared successfully"))
          .catch((error) => console.log('Error sharing', error));
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(`${title}\n\n${plainSummary}\n\nView more at: ${window.location.href}`)
          .then(() => toast.success("Content copied to clipboard for sharing"))
          .catch(() => toast.error("Failed to copy to clipboard"));
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Unable to share content");
    }
  };

  const handleFeedback = () => {
    navigate('/feedback', { 
      state: { 
        topic: title,
        category: "Legislation",
        referrer: window.location.pathname
      } 
    });
  };

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
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-civic-blue text-white p-1 rounded-full mr-2 text-xs">TL;DR</span>
              Plain Language Summary
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateSummary}
              disabled={isGenerating}
              className="flex items-center text-xs"
            >
              {isGenerating ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
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
        
        {/* Original Text Input */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="text-xs">Original Legislative Text</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Enter the official text of the legislation here. Click Generate with AI to create a plain language summary.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <Textarea 
            className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm min-h-60" 
            placeholder="Paste or enter the legislative text here..." 
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
        </div>
      </CardContent>
      
      <CardFooter className="bg-civic-blue/5 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleShare}>
          Share
        </Button>
        <Button variant="default" size="sm" onClick={handleFeedback}>
          Provide Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlainLanguageSummary;
