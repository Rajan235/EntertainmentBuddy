import {
  LayoutGrid,
  Clapperboard,
  Tv,
  Gamepad2,
  Clock,
  ListTodo,
  CheckCircle,
  Book,
  MonitorPlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { cn } from "@/lib/utils";

type CategoryFilter = Category | "ALL";
type StatusFilter = ProgressStatus | "ALL";

interface FilterBarProps {
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  onCategoryFilterChange: (filter: CategoryFilter) => void;
  onStatusFilterChange: (filter: StatusFilter) => void;
}

export function FilterBar({
  categoryFilter,
  statusFilter,
  onCategoryFilterChange,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3 mb-6">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterButton
          isActive={categoryFilter === "ALL"}
          onClick={() => onCategoryFilterChange("ALL")}
        >
          <LayoutGrid className="w-4 h-4 mr-2" /> All
        </FilterButton>
        <FilterButton
          isActive={categoryFilter === Category.MOVIE}
          onClick={() => onCategoryFilterChange(Category.MOVIE)}
        >
          <Clapperboard className="w-4 h-4 mr-2" /> Movies
        </FilterButton>
        <FilterButton
          isActive={categoryFilter === Category.SERIES}
          onClick={() => onCategoryFilterChange(Category.SERIES)}
        >
          <Tv className="w-4 h-4 mr-2" /> Series
        </FilterButton>
        <FilterButton
          isActive={categoryFilter === Category.GAME}
          onClick={() => onCategoryFilterChange(Category.GAME)}
        >
          <Gamepad2 className="w-4 h-4 mr-2" /> Games
        </FilterButton>
        <FilterButton
          isActive={categoryFilter === Category.ANIME}
          onClick={() => onCategoryFilterChange(Category.ANIME)}
        >
          <MonitorPlay className="w-4 h-4 mr-2" /> Anime
        </FilterButton>
        <FilterButton
          isActive={categoryFilter === Category.BOOK}
          onClick={() => onCategoryFilterChange(Category.BOOK)}
        >
          <Book className="w-4 h-4 mr-2" /> Books
        </FilterButton>
      </div>
      {/* Status Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterButton
          isActive={statusFilter === "ALL"}
          onClick={() => onStatusFilterChange("ALL")}
        >
          All Status
        </FilterButton>
        <FilterButton
          isActive={statusFilter === ProgressStatus.IN_PROGRESS}
          onClick={() => onStatusFilterChange(ProgressStatus.IN_PROGRESS)}
        >
          <Clock className="w-4 h-4 mr-2" /> In Progress
        </FilterButton>
        <FilterButton
          isActive={statusFilter === ProgressStatus.PLANNING}
          onClick={() => onStatusFilterChange(ProgressStatus.PLANNING)}
        >
          <ListTodo className="w-4 h-4 mr-2" /> Planning
        </FilterButton>
        <FilterButton
          isActive={statusFilter === ProgressStatus.COMPLETED}
          onClick={() => onStatusFilterChange(ProgressStatus.COMPLETED)}
        >
          <CheckCircle className="w-4 h-4 mr-2" /> Completed
        </FilterButton>
      </div>
    </div>
  );
}

function FilterButton({
  isActive,
  children,
  ...props
}: { isActive: boolean; children: React.ReactNode } & React.ComponentProps<
  typeof Button
>) {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      className={cn(
        "h-8 transition-all",
        isActive && "shadow-md shadow-primary/20"
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
