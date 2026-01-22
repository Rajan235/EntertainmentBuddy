"use client";

import { useState } from "react";
import { Film, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaSynopsisProps {
  description?: string; // Made optional for safety
}

export function MediaSynopsis({ description }: MediaSynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no description, show a fallback or return null
  if (!description) {
    return (
      <Card id="synopsis" className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Film className="w-5 h-5 text-primary" /> Synopsis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            No description available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Threshold for showing the "Read More" button
  const isLongText = description.length > 300;

  return (
    <Card id="synopsis">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Film className="w-5 h-5 text-primary" /> Synopsis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative",
            !isExpanded && isLongText && "max-h-[100px] overflow-hidden",
          )}
        >
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Gradient fade effect when collapsed */}
          {!isExpanded && isLongText && (
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
          )}
        </div>

        {isLongText && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-0 text-primary hover:text-primary/80 hover:bg-transparent font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <span className="flex items-center">
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </span>
            ) : (
              <span className="flex items-center">
                Read More <ChevronDown className="w-4 h-4 ml-1" />
              </span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
