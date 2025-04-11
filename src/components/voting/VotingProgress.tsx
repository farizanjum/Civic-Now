
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
  return (
    <Progress 
      value={value} 
      className={className}
      // Custom styling can be applied through the container class
      // The indicator is styled through Tailwind's data attributes
      style={{
        "--progress-indicator-color": indicatorClassName ? 
          indicatorClassName.includes("bg-") ? 
            `var(--${indicatorClassName.split("bg-")[1]})` : 
            undefined : 
          undefined
      } as React.CSSProperties}
    />
  );
};

export default VotingProgress;
