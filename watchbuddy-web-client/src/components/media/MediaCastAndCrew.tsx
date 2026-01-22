import { Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MediaCastAndCrewProps {
  creators?: string[];
  cast?: string[];
}

export function MediaCastAndCrew({
  creators = [],
  cast = [],
}: MediaCastAndCrewProps) {
  // If absolutely no data, hide the whole card
  if (creators.length === 0 && cast.length === 0) return null;

  return (
    <Card id="cast">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" /> Cast & Crew
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Creators Section */}
        {creators.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              Creators / Directors
            </h3>
            <div className="flex flex-wrap gap-2">
              {creators.map((creator) => (
                <Badge
                  key={creator}
                  variant="outline"
                  className="pl-2 pr-3 py-1 text-sm font-normal border-primary/20 bg-primary/5 hover:bg-primary/10"
                >
                  <User className="w-3 h-3 mr-2 opacity-50" />
                  {creator}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Separator if both exist */}
        {creators.length > 0 && cast.length > 0 && (
          <div className="h-px bg-border/50" />
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Main Cast
            </h3>
            {/* Using a ScrollArea here in case there are 50 actors */}
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex w-max space-x-2">
                {cast.map((actor) => (
                  <div
                    key={actor}
                    className="inline-flex items-center justify-center rounded-md border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {actor}
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
