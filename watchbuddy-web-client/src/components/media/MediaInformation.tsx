import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaDetails } from "@/types/media.types";

interface MediaInformationProps {
  media: MediaDetails;
}

export function MediaInformation({ media }: MediaInformationProps) {
  return (
    <Card id="info">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" /> Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="font-medium">{media.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Release Date</dt>
            <dd className="font-medium">{media.releaseDate}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Episodes</dt>
            <dd className="font-medium">{media.totalEpisodes}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Genres</dt>
            <dd className="flex flex-wrap gap-1.5 mt-1">
              {media.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
