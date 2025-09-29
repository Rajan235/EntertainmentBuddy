import { Button } from "@/components/ui/button";
import { FilterSidebar } from "@/components/layouts/FilterSidebar";

interface MobileFiltersProps {
  onClose: () => void;
}

export function MobileFilters({ onClose }: MobileFiltersProps) {
  return (
    <div className="lg:hidden fixed inset-0 bg-background/95 z-50 p-4 animate-in fade-in-20">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <FilterSidebar />
      </div>
    </div>
  );
}
