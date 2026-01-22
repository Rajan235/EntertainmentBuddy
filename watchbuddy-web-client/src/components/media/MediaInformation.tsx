import { Info, Monitor, Tv, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaDetails } from "@/types/media.types";
import { Category } from "@/types/tracking.types";

export function MediaInformation({ media }: { media: MediaDetails }) {
  // Format Date Nicely
  const formattedDate = media.releaseDate
    ? new Date(media.releaseDate).toLocaleDateString(undefined, {
        dateStyle: "long",
      })
    : "Unknown";
  // Dynamic label based on category
  const getPlatformLabel = () => {
    switch (media.category) {
      case Category.GAME:
        return "Available On";
      case Category.BOOK:
        return "Formats";
      default:
        return "Where to Watch";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="w-5 h-5 text-primary" /> Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="p-3 rounded-lg bg-muted/50">
            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Status
            </dt>
            <dd className="font-medium">{media.status || "Unknown"}</dd>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Release Date
            </dt>
            <dd className="font-medium">{formattedDate}</dd>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {media.category === "MOVIE" ? "Runtime" : "Episodes"}
            </dt>
            <dd className="font-medium">
              {media.totalEpisodes || "?"}{" "}
              {media.category === "MOVIE" ? "min" : ""}
            </dd>
          </div>
          {/* 🆕 PLATFORMS SECTION */}
          {media.platforms && media.platforms.length > 0 && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <dt className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                {media.category === Category.GAME ? (
                  <Monitor className="w-3 h-3" />
                ) : media.category === Category.BOOK ? (
                  <BookOpen className="w-3 h-3" />
                ) : (
                  <Tv className="w-3 h-3" />
                )}
                {getPlatformLabel()}
              </dt>
              <dd className="flex flex-wrap gap-2">
                {media.platforms.map((p) => (
                  <Badge
                    key={p}
                    variant="outline"
                    className="bg-background font-normal"
                  >
                    {p}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
          {/* 🆕 GENRES SECTION */}
          <div>
            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Genres
            </dt>
            <dd className="flex flex-wrap gap-2">
              {media.genres?.length > 0 ? (
                media.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="hover:bg-primary/20 transition-colors cursor-default"
                  >
                    {genre}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  No genres listed
                </span>
              )}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
