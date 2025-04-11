
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface VotingProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

const VotingProgress = ({ 
  value, 
  className, 
  indicatorClassName 
}: VotingProgressProps) => {
  // Create a custom style for the progress indicator
  const customStyles = {
    "--progress-color": indicatorClassName?.split("bg-")[1]
  } as React.CSSProperties;

  return (
    <div className={cn("relative w-full h-2 overflow-hidden rounded-full bg-secondary", className)}>
      <div 
        className={cn("h-full transition-all", indicatorClassName)}
        style={{ 
          width: `${value}%`,
        }}
      />
    </div>
  );
};

export default VotingProgress;
