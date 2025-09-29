"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackingForm } from "@/components/forms/TrackingForm";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { cn } from "@/lib/utils";
import { MediaDetails } from "@/types/media.types";
import { MediaHero } from "@/components/media/MediaHero";
import { MediaSynopsis } from "@/components/media/MediaSynopsis";
import { MediaCastAndCrew } from "@/components/media/MediaCastAndCrew";
import { MediaInformation } from "@/components/media/MediaInformation";
import { SimilarMedia } from "@/components/media/SimilarMedia";
import Image from "next/image";

export default function MediaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (heroRef.current) {
      setIsScrolled(latest > heroRef.current.offsetHeight - 80);
    }
  });

  // Mock data for a detailed media page, as if fetched from an API like TMDB
  const mediaDetails: MediaDetails = {
    id: params.id,
    title: "Shōgun",
    category: Category.SERIES,
    description:
      "In 1600s Japan, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him, when a mysterious European ship is found marooned in a nearby fishing village.",
    releaseDate: "2024-02-27",
    posterUrl: "/mock/shogun.jpg",
    backdropUrl: "/mock/shogun-backdrop.jpg",
    genres: ["Drama", "History", "War"],
    rating: 9.2,
    totalRatings: 15234,
    totalEpisodes: 10,
    status: ProgressStatus.COMPLETED, // Use the enum value for type safety
    creators: ["Rachel Kondo", "Justin Marks"],
    cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"],
  };

  return (
    <div className="max-w-7xl mx-auto">
      <MediaHero
        ref={heroRef}
        media={mediaDetails}
        onAddToList={() => setShowTrackingForm(true)}
      />

      {/* Sticky Nav */}
      <motion.div
        className={cn(
          // This should be inside a containing div with max-w-7xl and mx-auto
          "sticky top-16 z-20 -mx-8 mb-8 bg-background/80 backdrop-blur-lg border-b border-border transition-all",
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
        aria-hidden={!isScrolled}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Image
              src={mediaDetails.posterUrl || "/placeholder-poster.png"}
              alt={mediaDetails.title}
              width={40}
              height={60}
              className="rounded-md"
            />
            <div>
              <h2 className="font-bold text-lg">{mediaDetails.title}</h2>
              <p className="text-sm text-muted-foreground">
                {mediaDetails.releaseDate.substring(0, 4)}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowTrackingForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add to List
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MediaSynopsis description={mediaDetails.description} />
          <MediaCastAndCrew
            creators={mediaDetails.creators}
            cast={mediaDetails.cast}
          />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MediaInformation media={mediaDetails} />
          <SimilarMedia />
        </motion.div>
      </div>

      {/* Tracking Form Modal */}
      {showTrackingForm && (
        <TrackingForm
          mediaId={mediaDetails.id}
          mediaTitle={mediaDetails.title}
          category={mediaDetails.category}
          totalEpisodes={mediaDetails.totalEpisodes}
          onClose={() => setShowTrackingForm(false)}
        />
      )}
    </div>
  );
}
