import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Clapperboard, Tv, Gamepad2 } from "lucide-react";
import {
  Category,
  ProgressStatus,
  type TrackingEntry,
} from "@/types/tracking.types";
import { cn } from "@/lib/utils";

const categoryIcons = {
  [Category.MOVIE]: Clapperboard,
  [Category.SERIES]: Tv,
  [Category.GAME]: Gamepad2,
};

const statusStyles: Record<ProgressStatus, string> = {
  [ProgressStatus.COMPLETED]:
    "bg-green-500/20 text-green-400 border-green-500/30",
  [ProgressStatus.IN_PROGRESS]:
    "bg-primary/20 text-primary-foreground/80 border-primary/30",
  [ProgressStatus.PLANNING]:
    "bg-amber-500/20 text-amber-400 border-amber-500/30",
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

  const CategoryIcon = categoryIcons[category];
  const progressPercentage =
    totalEpisodes && progress ? (progress / totalEpisodes) * 100 : 0;

  return (
    <Link
      href={`/media/${id}`}
      className="group block outline-none"
      tabIndex={0}
    >
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 border-transparent bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <div className="aspect-[2/3] w-full relative">
          <Image
            src={posterUrl || "/placeholder-poster.png"}
            alt={`Poster for ${title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold">
            <CategoryIcon className="w-3 h-3" />
            <span>{category}</span>
          </div>
          {rating && (
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-white">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3
            className="font-semibold text-sm truncate group-hover:text-primary transition-colors"
            title={title}
          >
            {title}
          </h3>
        </CardContent>
        {status === ProgressStatus.IN_PROGRESS && totalEpisodes ? (
          <CardFooter className="p-3 pt-0">
            <div className="w-full">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>
                  {progress}/{totalEpisodes}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-1.5" />
            </div>
          </CardFooter>
        ) : (
          <CardFooter className="p-3 pt-0">
            <Badge
              variant="outline"
              className={cn("text-xs", statusStyles[status])}
            >
              {status.replace("_", " ")}
            </Badge>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
