import { Filter } from "lucide-react";

export function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-secondary rounded-lg mt-8">
      <Filter className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-1">No Results Found</h3>
      <p className="text-muted-foreground">
        Try adjusting your filters to find what you're looking for.
      </p>
    </div>
  );
}
