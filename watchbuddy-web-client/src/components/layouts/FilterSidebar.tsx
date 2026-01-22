import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Clapperboard,
  Tv,
  Gamepad2,
  MonitorPlay,
  Book,
  Clock,
  ListTodo,
  CheckCircle,
  X,
} from "lucide-react";
const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Romance",
  "Thriller",
];
const ratings = ["Any", "5 Stars", "4+ Stars", "3+ Stars", "2+ Stars"];
// 2. Update Interface to accept new filters
interface FilterSidebarProps {
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
export function FilterSidebar({
  selectedCategory,
  selectedStatus,
  selectedGenre,
  selectedRating,
  onCategoryChange,
  onStatusChange,
  onGenreChange,
  onRatingChange,
  onClearFilters,
}: FilterSidebarProps) {
  // Hardcoded list of common genres (Your API should eventually provide this list dynamically)
  const GENRES = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Sci-Fi",
    "Thriller",
  ];
  const RATINGS = [9, 8, 7, 6, 5]; // 9+, 8+, etc.
  // Helper to render filter buttons consistently
  const renderFilterItem = (
    label: string,
    isActive: boolean,
    onClick: () => void,
    icon?: React.ReactNode,
  ) => (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  );
  // return (
  //   <div className="space-y-6">
  //     <Accordion
  //       type="multiple"
  //       defaultValue={["genre", "rating"]}
  //       className="w-full"
  //     >
  //       <AccordionItem value="genre">
  //         <AccordionTrigger className="text-base font-semibold">
  //           Genre
  //         </AccordionTrigger>
  //         <AccordionContent>
  //           <div className="grid grid-cols-2 gap-2 pt-2">
  //             {genres.map((genre) => (
  //               <div key={genre} className="flex items-center space-x-2">
  //                 <Checkbox id={`genre-${genre}`} />
  //                 <label
  //                   htmlFor={`genre-${genre}`}
  //                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  //                 >
  //                   {genre}
  //                 </label>
  //               </div>
  //             ))}
  //           </div>
  //         </AccordionContent>
  //       </AccordionItem>
  //       <AccordionItem value="rating">
  //         <AccordionTrigger className="text-base font-semibold">
  //           Rating
  //         </AccordionTrigger>
  //         <AccordionContent>
  //           <div className="space-y-2 pt-2">
  //             {ratings.map((rating) => (
  //               <div key={rating} className="flex items-center space-x-2">
  //                 <Checkbox id={`rating-${rating}`} />
  //                 <label
  //                   htmlFor={`rating-${rating}`}
  //                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  //                 >
  //                   {rating}
  //                 </label>
  //               </div>
  //             ))}
  //           </div>
  //         </AccordionContent>
  //       </AccordionItem>
  //     </Accordion>
  //     <div className="flex gap-2">
  //       <Button variant="secondary" className="flex-1">
  //         Reset
  //       </Button>
  //       <Button className="flex-1">Apply</Button>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="space-y-8">
  //     {/* Header with Clear Button */}
  //     <div className="flex items-center justify-between">
  //       <h3 className="font-semibold text-lg">Filters</h3>
  //       {(selectedCategory !== "ALL" || selectedStatus !== "ALL") && (
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           onClick={onClearFilters}
  //           className="h-8 px-2 text-muted-foreground hover:text-destructive"
  //         >
  //           <X className="w-3 h-3 mr-1" /> Clear
  //         </Button>
  //       )}
  //     </div>
  //     {/* <div className="space-y-6">
  //     <div className="flex items-center justify-between">
  //       <h3 className="font-semibold text-lg">Filters</h3>
  //       <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2 text-muted-foreground hover:text-destructive">
  //         <X className="w-3 h-3 mr-1" /> Clear
  //       </Button>
  //     </div> */}

  //     {/* Categories Section */}
  //     <div className="space-y-2">
  //       <h4 className="text-sm font-semibold text-foreground/70 mb-2 px-3 uppercase tracking-wider">
  //         Category
  //       </h4>
  //       <div className="space-y-1">
  //         {renderFilterItem(
  //           "All Categories",
  //           selectedCategory === "ALL",
  //           () => onCategoryChange("ALL"),
  //           <LayoutGrid />,
  //         )}
  //         {renderFilterItem(
  //           "Movies",
  //           selectedCategory === Category.MOVIE,
  //           () => onCategoryChange(Category.MOVIE),
  //           <Clapperboard />,
  //         )}
  //         {renderFilterItem(
  //           "Series",
  //           selectedCategory === Category.SERIES,
  //           () => onCategoryChange(Category.SERIES),
  //           <Tv />,
  //         )}
  //         {renderFilterItem(
  //           "Anime",
  //           selectedCategory === Category.ANIME,
  //           () => onCategoryChange(Category.ANIME),
  //           <MonitorPlay />,
  //         )}
  //         {renderFilterItem(
  //           "Games",
  //           selectedCategory === Category.GAME,
  //           () => onCategoryChange(Category.GAME),
  //           <Gamepad2 />,
  //         )}
  //         {renderFilterItem(
  //           "Books",
  //           selectedCategory === Category.BOOK,
  //           () => onCategoryChange(Category.BOOK),
  //           <Book />,
  //         )}
  //       </div>
  //     </div>

  //     <div className="h-px bg-border/50 my-4" />

  //     {/* Status Section */}
  //     <div className="space-y-2">
  //       <h4 className="text-sm font-semibold text-foreground/70 mb-2 px-3 uppercase tracking-wider">
  //         Status
  //       </h4>
  //       <div className="space-y-1">
  //         {renderFilterItem(
  //           "All Statuses",
  //           selectedStatus === "ALL",
  //           () => onStatusChange("ALL"),
  //           <LayoutGrid />,
  //         )}
  //         {renderFilterItem(
  //           "In Progress",
  //           selectedStatus === ProgressStatus.IN_PROGRESS,
  //           () => onStatusChange(ProgressStatus.IN_PROGRESS),
  //           <Clock />,
  //         )}
  //         {renderFilterItem(
  //           "Planning",
  //           selectedStatus === ProgressStatus.PLANNING,
  //           () => onStatusChange(ProgressStatus.PLANNING),
  //           <ListTodo />,
  //         )}
  //         {renderFilterItem(
  //           "Completed",
  //           selectedStatus === ProgressStatus.COMPLETED,
  //           () => onStatusChange(ProgressStatus.COMPLETED),
  //           <CheckCircle />,
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 px-2 text-muted-foreground hover:text-destructive"
        >
          <X className="w-3 h-3 mr-1" /> Clear
        </Button>
      </div>

      {/* --- EXISTING CATEGORY & STATUS BUTTONS HERE (Keep them!) --- */}
      {/* Categories Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground/70 mb-2 px-3 uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-1">
          {renderFilterItem(
            "All Categories",
            selectedCategory === "ALL",
            () => onCategoryChange("ALL"),
            <LayoutGrid />,
          )}
          {renderFilterItem(
            "Movies",
            selectedCategory === Category.MOVIE,
            () => onCategoryChange(Category.MOVIE),
            <Clapperboard />,
          )}
          {renderFilterItem(
            "Series",
            selectedCategory === Category.SERIES,
            () => onCategoryChange(Category.SERIES),
            <Tv />,
          )}
          {renderFilterItem(
            "Anime",
            selectedCategory === Category.ANIME,
            () => onCategoryChange(Category.ANIME),
            <MonitorPlay />,
          )}
          {renderFilterItem(
            "Games",
            selectedCategory === Category.GAME,
            () => onCategoryChange(Category.GAME),
            <Gamepad2 />,
          )}
          {renderFilterItem(
            "Books",
            selectedCategory === Category.BOOK,
            () => onCategoryChange(Category.BOOK),
            <Book />,
          )}
        </div>

        <div className="h-px bg-border/50 my-4" />

        {/* Status Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground/70 mb-2 px-3 uppercase tracking-wider">
            Status
          </h4>
          <div className="space-y-1">
            {renderFilterItem(
              "All Statuses",
              selectedStatus === "ALL",
              () => onStatusChange("ALL"),
              <LayoutGrid />,
            )}
            {renderFilterItem(
              "In Progress",
              selectedStatus === ProgressStatus.IN_PROGRESS,
              () => onStatusChange(ProgressStatus.IN_PROGRESS),
              <Clock />,
            )}
            {renderFilterItem(
              "Planning",
              selectedStatus === ProgressStatus.PLANNING,
              () => onStatusChange(ProgressStatus.PLANNING),
              <ListTodo />,
            )}
            {renderFilterItem(
              "Completed",
              selectedStatus === ProgressStatus.COMPLETED,
              () => onStatusChange(ProgressStatus.COMPLETED),
              <CheckCircle />,
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50 my-4" />

      {/* 🆕 ACCORDION SECTIONS */}
      <Accordion
        type="multiple"
        defaultValue={["genre", "rating"]}
        className="w-full"
      >
        {/* Genre Section */}
        <AccordionItem value="genre" className="border-none">
          <AccordionTrigger className="text-sm font-semibold py-2 hover:no-underline">
            GENRE
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {/* "All Genres" Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="genre-all"
                  checked={selectedGenre === "ALL"}
                  onCheckedChange={() => onGenreChange("ALL")}
                />
                <label htmlFor="genre-all" className="text-sm cursor-pointer">
                  All Genres
                </label>
              </div>

              {/* Genre List */}
              {GENRES.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={selectedGenre === genre}
                    onCheckedChange={() => onGenreChange(genre)}
                  />
                  <label
                    htmlFor={`genre-${genre}`}
                    className="text-sm cursor-pointer"
                  >
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Section */}
        <AccordionItem value="rating" className="border-none">
          <AccordionTrigger className="text-sm font-semibold py-2 hover:no-underline">
            RATING
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 pt-1">
              {/* "Any Rating" Option */}
              <button
                onClick={() => onRatingChange("ALL")}
                className={cn(
                  "w-full text-left text-sm py-1 px-2 rounded",
                  selectedRating === "ALL"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                Any Rating
              </button>

              {/* Rating List (9+ Stars, etc.) */}
              {RATINGS.map((rating) => (
                <button
                  key={rating}
                  onClick={() => onRatingChange(rating)}
                  className={cn(
                    "w-full text-left text-sm py-1 px-2 rounded flex items-center",
                    selectedRating === rating
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex items-center mr-2">
                    {rating}
                    <Star className="w-3 h-3 ml-0.5 fill-current" />
                  </span>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
