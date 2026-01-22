import { Button } from "@/components/ui/button";
import { FilterSidebar } from "@/components/layouts/FilterSidebar";
import { X } from "lucide-react";
import { Category, ProgressStatus } from "@/types/tracking.types";

// Must accept the same props to pass them down
interface MobileFiltersProps {
  onClose: () => void;
  selectedCategory: Category | "ALL";
  selectedStatus: ProgressStatus | "ALL";
  selectedGenre: string | "ALL"; // 🆕
  selectedRating: number | "ALL"; // 🆕
  onCategoryChange: (c: Category | "ALL") => void;
  onStatusChange: (s: ProgressStatus | "ALL") => void;
  onGenreChange: (g: string | "ALL") => void; // 🆕
  onRatingChange: (r: number | "ALL") => void; // 🆕
  onClearFilters: () => void;
}

export function MobileFilters({
  onClose,
  ...filterProps // Spread the rest to pass to Sidebar
}: MobileFiltersProps) {
  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar Sheet */}
      <div className="relative w-full max-w-xs h-full bg-background border-r p-6 shadow-xl animate-in slide-in-from-left duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <FilterSidebar {...filterProps} />

        <div className="mt-8 pt-6 border-t">
          <Button className="w-full" onClick={onClose}>
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}
