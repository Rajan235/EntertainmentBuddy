import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SimilarMedia() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3 p-2 -m-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="w-12 h-18 bg-secondary rounded flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm line-clamp-1">
                Related Title {i}
              </p>
              <p className="text-xs text-muted-foreground">Series • 2024</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
