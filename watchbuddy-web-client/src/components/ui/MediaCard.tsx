"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Clapperboard,
  Tv,
  Gamepad2,
  Book,
  Sparkles,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import {
  Category,
  ProgressStatus,
  type TrackingEntry,
} from "@/types/tracking.types";
import { cn } from "@/lib/utils";
import { TrackingForm } from "@/components/forms/TrackingForm"; // Import the form

const categoryIcons: Record<string, LucideIcon> = {
  [Category.MOVIE]: Clapperboard,
  [Category.SERIES]: Tv,
  [Category.ANIME]: Sparkles,
  [Category.GAME]: Gamepad2,
  [Category.BOOK]: Book,
};

const statusStyles: Record<ProgressStatus, string> = {
  [ProgressStatus.COMPLETED]:
    "bg-green-500/10 text-green-500 border-green-500/20",
  [ProgressStatus.IN_PROGRESS]:
    "bg-blue-500/10 text-blue-500 border-blue-500/20",
  [ProgressStatus.PLANNING]:
    "bg-amber-500/10 text-amber-500 border-amber-500/20",
  [ProgressStatus.DROPPED]: "bg-red-500/10 text-red-500 border-red-500/20",
  [ProgressStatus.ON_HOLD]: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function MediaCard(props: TrackingEntry) {
  const {
    id,
    title,
    category,
    status,
    rating,
    posterUrl,
    progress,
    totalEpisodes,
  } = props;

  // Local state to open the Edit Modal
  const [showEdit, setShowEdit] = useState(false);

  // Fallback icon
  const CategoryIcon = categoryIcons[category] || Sparkles;

  // Safe Progress Calculation (avoid division by zero)
  const progressPercentage =
    totalEpisodes && totalEpisodes > 0 && progress
      ? Math.min((progress / totalEpisodes) * 100, 100)
      : 0;

  // 1. FIX: Include 'type' in URL for correct routing
  const detailLink = `/media/${id}?type=${category}`;

  // 2. Handler: Stop navigation when clicking Edit
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEdit(true);
  };

  return (
    <>
      <Link href={detailLink} className="group block outline-none" tabIndex={0}>
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card/50 border-white/5">
          {/* IMAGE CONTAINER */}
          <div className="aspect-[2/3] w-full relative overflow-hidden bg-muted">
            <Image
              src={posterUrl || "/placeholder-poster.png"}
              alt={`Poster for ${title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            {/* Category Badge (Top Right) */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
              <CategoryIcon className="w-3 h-3" />
              {category}
            </div>

            {/* 3. NEW: Edit Button (Top Left - Visible on Hover) */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
                onClick={handleEditClick}
                title="Quick Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Rating (Bottom Left) */}
            {rating && rating > 0 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-sm text-white drop-shadow-md">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <CardContent className="p-3 flex-1">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </CardContent>

          {/* FOOTER: Progress Bar OR Status Badge */}
          <CardFooter className="p-3 pt-0 mt-auto">
            {status === ProgressStatus.IN_PROGRESS && totalEpisodes ? (
              <div className="w-full space-y-1.5">
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-medium">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-1 bg-muted" />
                <div className="text-[10px] text-right text-muted-foreground">
                  {progress} / {totalEpisodes}{" "}
                  {category === Category.BOOK ? "pg" : "ep"}
                </div>
              </div>
            ) : (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-2 py-0.5 h-5 border font-medium uppercase tracking-wide",
                  statusStyles[status] || statusStyles[ProgressStatus.PLANNING],
                )}
              >
                {status?.replace("_", " ") || "PLANNING"}
              </Badge>
            )}
          </CardFooter>
        </Card>
      </Link>

      {/* 4. The Edit Modal */}
      {showEdit && (
        <TrackingForm
          mediaId={id}
          mediaTitle={title}
          category={category}
          posterUrl={posterUrl}
          totalEpisodes={totalEpisodes}
          // Since this card is generated from a TrackingEntry,
          // we already have the user's data to pre-fill!
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
