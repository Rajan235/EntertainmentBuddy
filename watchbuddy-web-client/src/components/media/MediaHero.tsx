"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Plus, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaDetails } from "@/types/media.types";

interface MediaHeroProps {
  media: MediaDetails;
  onAddToList: () => void;
}

export const MediaHero = forwardRef<HTMLDivElement, MediaHeroProps>(
  ({ media, onAddToList }, ref) => (
    <div
      ref={ref}
      className="relative h-[450px] -mx-8 mb-8 overflow-hidden -mt-16"
    >
      <Image
        src={media.backdropUrl || "/placeholder-backdrop.png"}
        alt={`Backdrop for ${media.title}`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="relative z-10 h-full flex items-end p-8">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <motion.div
            className="w-48 h-72 bg-card rounded-lg overflow-hidden flex-shrink-0 shadow-2xl shadow-black/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            layoutId={`poster-${media.id}`}
          >
            <Image
              src={media.posterUrl || "/placeholder-poster.png"}
              alt={`Poster for ${media.title}`}
              width={192}
              height={288}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="secondary" className="mb-2">
              {media.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{media.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-lg">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{media.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({media.totalRatings.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{media.totalEpisodes} episodes</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={onAddToList} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Add to List
              </Button>
              <Button variant="outline" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Watch Trailer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
);

MediaHero.displayName = "MediaHero";
