"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { FilterSidebar } from "@/components/layouts/FilterSidebar";
import { useTracking } from "@/hooks/useTracking";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { ListsHeader } from "@/components/lists/ListsHeader";
import { ListsControls } from "@/components/lists/ListsControls";
import { FilterBar } from "@/components/lists/FilterBar";
import { MediaGridView } from "@/components/lists/MediaGridView";
import { NoResults } from "@/components/lists/NoResults";
import { MobileFilters } from "@/components/lists/MobileFilters";

type CategoryFilter = Category | "ALL";
type StatusFilter = ProgressStatus | "ALL";

export default function ListsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { allEntries, isLoading } = useTracking();

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const searchMatch =
        debouncedSearchTerm === "" ||
        entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const categoryMatch =
        categoryFilter === "ALL" || entry.category === categoryFilter;
      const statusMatch =
        statusFilter === "ALL" || entry.status === statusFilter;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [allEntries, debouncedSearchTerm, categoryFilter, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto">
      <ListsHeader />

      <ListsControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onShowFilters={() => setShowFilters(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <FilterBar
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        onCategoryFilterChange={setCategoryFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="flex gap-6">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {viewMode === "grid" ? (
            <MediaGridView entries={filteredEntries} isLoading={isLoading} />
          ) : (
            <div className="space-y-4">
              {/* List view implementation */}
              <p className="text-muted-foreground">List view coming soon...</p>
            </div>
          )}

          {!isLoading && filteredEntries.length === 0 && <NoResults />}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && <MobileFilters onClose={() => setShowFilters(false)} />}
    </div>
  );
}
