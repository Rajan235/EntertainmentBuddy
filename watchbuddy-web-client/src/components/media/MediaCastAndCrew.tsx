import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MediaCastAndCrewProps {
  creators: string[];
  cast: string[];
}

export function MediaCastAndCrew({ creators, cast }: MediaCastAndCrewProps) {
  return (
    <Card id="cast">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" /> Cast & Crew
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Creators
          </h3>
          <div className="flex flex-wrap gap-2">
            {creators.map((creator) => (
              <Badge key={creator} variant="secondary">
                {creator}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Main Cast
          </h3>
          <div className="flex flex-wrap gap-2">
            {cast.map((actor) => (
              <Badge key={actor} variant="secondary">
                {actor}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
