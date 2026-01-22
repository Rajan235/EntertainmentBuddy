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
  const [genreFilter, setGenreFilter] = useState<string | "ALL">("ALL");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");

  const filteredEntries = useMemo(() => {
    if (!allEntries) return [];

    return allEntries.filter((entry) => {
      // ... existing checks (search, category, status)
      const searchMatch =
        debouncedSearchTerm === "" ||
        entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const categoryMatch =
        categoryFilter === "ALL" || entry.category === categoryFilter;
      const statusMatch =
        statusFilter === "ALL" || entry.status === statusFilter;

      // 👇 Genre Logic: Check if the entry's genre list includes the selected genre
      // We use safe navigation (entry.genres?) in case some old data doesn't have genres yet.
      const genreMatch =
        genreFilter === "ALL" ||
        (entry.genres && entry.genres.includes(genreFilter));

      // 👇 Rating Logic: Check if entry rating is greater than or equal to filter
      const ratingMatch =
        ratingFilter === "ALL" ||
        (entry.rating !== undefined && entry.rating >= ratingFilter);

      return (
        searchMatch && categoryMatch && statusMatch && genreMatch && ratingMatch
      );
    });
  }, [
    allEntries,
    debouncedSearchTerm,
    categoryFilter,
    statusFilter,
    genreFilter,
    ratingFilter,
  ]); // 👈 Add new dependencies!

  // 3. 🆕 Update Clear Logic
  const handleClearFilters = () => {
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
    setGenreFilter("ALL"); // Reset Genre
    setRatingFilter("ALL"); // Reset Rating
    setSearchTerm("");
  };

  // return (
  //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //     <ListsHeader />

  //     <ListsControls
  //       viewMode={viewMode}
  //       onViewModeChange={setViewMode}
  //       onShowFilters={() => setShowFilters(true)}
  //       searchTerm={searchTerm}
  //       onSearchChange={setSearchTerm}
  //     />

  //     <FilterBar
  //       categoryFilter={categoryFilter}
  //       statusFilter={statusFilter}
  //       onCategoryFilterChange={setCategoryFilter}
  //       onStatusFilterChange={setStatusFilter}
  //     />

  //     <div className="flex gap-6">
  //       {/* Filters Sidebar - Desktop */}
  //       <aside className="hidden lg:block w-64 flex-shrink-0">
  //         <FilterSidebar />
  //       </aside>

  //       {/* Content */}
  //       <div className="flex-1 min-w-0">
  //         {viewMode === "grid" ? (
  //           <MediaGridView entries={filteredEntries} isLoading={isLoading} />
  //         ) : (
  //           <div className="space-y-4">
  //             {/* List view implementation */}
  //             <p className="text-muted-foreground">List view coming soon...</p>
  //           </div>
  //         )}

  //         {!isLoading && filteredEntries.length === 0 && <NoResults />}
  //       </div>
  //     </div>

  //     {/* Mobile Filters Modal */}
  //     {showFilters && <MobileFilters onClose={() => setShowFilters(false)} />}
  //   </div>
  // );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ListsHeader />

      <ListsControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onShowFilters={() => setShowFilters(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex gap-8 mt-8">
        {/* Desktop Sidebar - Now receives Props! */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            {" "}
            {/* Makes sidebar sticky while scrolling */}
            <FilterSidebar
              selectedCategory={categoryFilter}
              selectedStatus={statusFilter}
              selectedGenre={genreFilter} // 👈
              selectedRating={ratingFilter} // 👈
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
              onGenreChange={setGenreFilter} // 👈
              onRatingChange={setRatingFilter} // 👈
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {viewMode === "grid" ? (
            <MediaGridView entries={filteredEntries} isLoading={isLoading} />
          ) : (
            <div className="p-12 text-center border border-dashed rounded-lg bg-muted/20">
              <p className="text-muted-foreground">List view coming soon...</p>
            </div>
          )}

          {!isLoading && filteredEntries.length === 0 && (
            <NoResults onClearFilters={handleClearFilters} />
          )}
        </div>
      </div>

      {/* Mobile Filters Modal - Connected to State */}
      {showFilters && (
        <MobileFilters
          onClose={() => setShowFilters(false)}
          // Pass ALL the same props here too
          selectedCategory={categoryFilter}
          selectedStatus={statusFilter}
          selectedGenre={genreFilter}
          selectedRating={ratingFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onGenreChange={setGenreFilter}
          onRatingChange={setRatingFilter}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
