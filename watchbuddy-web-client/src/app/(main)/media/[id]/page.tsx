"use client";

//import { useState, useRef, useEffect } from "react";
import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackingForm } from "@/components/forms/TrackingForm";
//import { Category, ProgressStatus } from "@/types/tracking.types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/client/client";

import { cn } from "@/lib/utils";
import { MediaDetails } from "@/types/media.types";
import { MediaHero } from "@/components/media/MediaHero";
import { MediaSynopsis } from "@/components/media/MediaSynopsis";
import { MediaCastAndCrew } from "@/components/media/MediaCastAndCrew";
import { MediaInformation } from "@/components/media/MediaInformation";
import { SimilarMedia } from "@/components/media/SimilarMedia";
import { MediaCardSkeleton as MediaDetailSkeleton } from "@/components/ui/SkeletonLoader";
import Image from "next/image";

export default function MediaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  //const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
  //const [isLoading, setIsLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (heroRef.current) {
      setIsScrolled(latest > heroRef.current.offsetHeight - 80);
    }
  });

  /*useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/media/${params.id}`);
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Media not found"
              : "Failed to fetch media details"
          );
        }
        const data: MediaDetails = await response.json();
        setMediaDetails(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetails();
  }, [params.id]);*/
  const {
    data: mediaDetails,
    isLoading,
    error,
  } = useQuery<MediaDetails, Error>({
    queryKey: ["mediaDetails", params.id],
    queryFn: () => apiClient<MediaDetails>(`/media/${params.id}`),
    retry: 1, // Don't retry too many times for a 404
  });

  if (isLoading) {
    return <MediaDetailSkeleton />;
  }

  if (error || !mediaDetails) {
    return (
      <div className="text-center py-20 text-destructive">
        Error:{" "}
        {error?.message ||
          "Media details could not be loaded or were not found."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <MediaHero
        ref={heroRef}
        media={mediaDetails} // We know mediaDetails is defined here because of the check above
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
              alt={mediaDetails.title} // Safe to access
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
