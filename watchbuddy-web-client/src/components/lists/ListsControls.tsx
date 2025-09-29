import { Search, Grid, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ListsControlsProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onShowFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function ListsControls({
  viewMode,
  onViewModeChange,
  onShowFilters,
  searchTerm,
  onSearchChange,
}: ListsControlsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search your lists..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onShowFilters} className="lg:hidden">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        <div className="flex bg-secondary rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className="h-8 w-8"
          >
            <Grid className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            className="h-8 w-8"
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
