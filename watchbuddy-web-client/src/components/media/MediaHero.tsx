"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Plus, Star, Clock, Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaDetails } from "@/types/media.types";

import { Category } from "@/types/tracking.types";
interface MediaHeroProps {
  media: MediaDetails;
  onAddToList: () => void;
  isTracking?: boolean; // 👈 New optional prop
}

export const MediaHero = forwardRef<HTMLDivElement, MediaHeroProps>(
  ({ media, onAddToList, isTracking }, ref) => {
    // Helper: Format Runtime vs Episodes
    const getDurationText = () => {
      if (media.category === Category.MOVIE) {
        // Assuming backend might send runtime in minutes, or reuse totalEpisodes field for now
        return media.totalEpisodes
          ? `${media.totalEpisodes} min`
          : "Runtime N/A";
      }
      return `${media.totalEpisodes || "?"} episodes`;
    };

    return (
      <div
        ref={ref}
        className="relative h-[450px] -mx-8 mb-8 overflow-hidden -mt-16 group"
      >
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={media.backdropUrl || "/placeholder-backdrop.png"}
            alt={`Backdrop for ${media.title}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        </div>

        <div className="relative z-10 h-full flex items-end p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 w-full items-end">
            {/* Poster Card */}
            <motion.div
              className="w-40 md:w-52 aspect-[2/3] bg-card rounded-lg overflow-hidden flex-shrink-0 shadow-2xl shadow-black/50 border border-white/10 hidden sm:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layoutId={`poster-${media.id}`}
            >
              <Image
                src={media.posterUrl || "/placeholder-poster.png"}
                alt={`Poster for ${media.title}`}
                width={208}
                height={312}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Content Info */}
            <motion.div
              className="flex-1 mb-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="uppercase tracking-wider font-bold"
                >
                  {media.category}
                </Badge>
                {media.userStatus && (
                  <Badge
                    variant="outline"
                    className="bg-primary/20 text-primary border-primary/50"
                  >
                    {media.userStatus.replace("_", " ")}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md leading-tight">
                {media.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-6 text-white/90">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-lg">
                    {media.rating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-sm opacity-70">
                    ({media.totalRatings?.toLocaleString() || 0})
                  </span>
                </div>

                {/* Duration/Episodes */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{getDurationText()}</span>
                </div>

                {/* Year */}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {media.releaseDate
                      ? new Date(media.releaseDate).getFullYear()
                      : "TBA"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className="flex gap-3"> */}
              {/* <Button
                  onClick={onAddToList}
                  size="lg"
                  className="font-semibold shadow-lg shadow-primary/20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to List
                </Button>
                {/* Only show if we theoretically had a trailer link */}
              {/* <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Trailer
                </Button> */}
              {/* </div>  */}
              <div className="flex gap-3">
                <Button
                  onClick={onAddToList}
                  size="lg"
                  variant={isTracking ? "secondary" : "default"} // Change visual style
                  className="font-semibold shadow-lg"
                >
                  {isTracking ? (
                    <>
                      <Pencil className="w-5 h-5 mr-2" />
                      Edit Entry
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add to List
                    </>
                  )}
                </Button>
                {/* ... Trailer button ... */}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  },
);

MediaHero.displayName = "MediaHero";
