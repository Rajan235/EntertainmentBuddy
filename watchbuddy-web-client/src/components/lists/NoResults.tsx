import { Filter, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  onClearFilters: () => void;
}

export function NoResults({ onClearFilters }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-secondary/30 border border-dashed rounded-lg mt-8">
      <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
        <XCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        We couldn't find any media matching your current filters. Try adjusting
        them or search for something else.
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </div>
  );
}
