import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaDetails } from "@/types/media.types";
import Link from "next/link";
import Image from "next/image";

// Accept real data from parent (or fetch it if you prefer)
// For MVP, passing it down is cleaner.
interface SimilarMediaProps {
  similar?: MediaDetails[]; // Optional for now
}

export function SimilarMedia({ similar = [] }: SimilarMediaProps) {
  if (!similar || similar.length === 0) return null; // Don't show if empty

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Similar Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similar.slice(0, 5).map((item) => (
          <Link
            href={`/media/${item.id}?type=${item.category}`}
            key={item.id}
            className="flex gap-3 group"
          >
            {/* Tiny Poster */}
            <div className="relative w-16 h-24 bg-muted rounded overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
              <Image
                src={item.posterUrl || "/placeholder-poster.png"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 py-1">
              <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground border px-1 rounded">
                  {item.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.releaseDate
                    ? new Date(item.releaseDate).getFullYear()
                    : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
