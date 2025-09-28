import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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

export function FilterSidebar() {
  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        defaultValue={["genre", "rating"]}
        className="w-full"
      >
        <AccordionItem value="genre">
          <AccordionTrigger className="text-base font-semibold">
            Genre
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox id={`genre-${genre}`} />
                  <label
                    htmlFor={`genre-${genre}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger className="text-base font-semibold">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {rating}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1">
          Reset
        </Button>
        <Button className="flex-1">Apply</Button>
      </div>
    </div>
  );
}
