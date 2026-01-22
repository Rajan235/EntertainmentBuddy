"use client";

//import { useState, useRef, useEffect } from "react";
import { useState, useRef, use } from "react";
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
import { useSearchParams } from "next/navigation"; // 1. Import this
import Image from "next/image";
// 👇 IMPORT MOCK DATA AND HELPER
import { getMediaDetailsById } from "@/lib/mock-data";

// 🚨 FORCE MOCK MODE ON
const USE_MOCK_DATA = true;
export default function MediaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  //const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
  //const [isLoading, setIsLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const searchParams = useSearchParams();
  const mediaType = searchParams.get("type");

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
    queryKey: ["mediaDetails", id, mediaType],
    queryFn: async () => {
      // 👇 INTERCEPT HERE: If Mock Mode is on, return fake data immediately
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 500));
        // Use the helper to get data + user status
        const data = getMediaDetailsById(id);
        if (!data) throw new Error("Media not found in Mock DB");
        return data;
      }

      // Real Backend Call (Will not run if USE_MOCK_DATA is true)
      if (!mediaType) throw new Error("Media Type is missing");
      return apiClient<MediaDetails>(`/media/${id}?type=${mediaType}`);
    },
    enabled: !!mediaType, // Don't run query if type is missing
    retry: 1,
  });

  if (!mediaType) {
    return (
      <div className="p-20 text-center text-destructive">
        Invalid Link: Missing Media Type
      </div>
    );
  }

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

  // return (
  //   <div className="max-w-7xl mx-auto">
  //     <MediaHero
  //       ref={heroRef}
  //       media={mediaDetails} // We know mediaDetails is defined here because of the check above
  //       onAddToList={() => setShowTrackingForm(true)}
  //     />

  //     {/* Sticky Nav */}
  //     <motion.div
  //       className={cn(
  //         // This should be inside a containing div with max-w-7xl and mx-auto
  //         "sticky top-16 z-20 -mx-8 mb-8 bg-background/80 backdrop-blur-lg border-b border-border transition-all",
  //         isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
  //       )}
  //       aria-hidden={!isScrolled}
  //     >
  //       <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
  //         <div className="flex items-center gap-4">
  //           <Image
  //             src={mediaDetails.posterUrl || "/placeholder-poster.png"}
  //             alt={mediaDetails.title} // Safe to access
  //             width={40}
  //             height={60}
  //             className="rounded-md"
  //           />
  //           <div>
  //             <h2 className="font-bold text-lg">{mediaDetails.title}</h2>
  //             <p className="text-sm text-muted-foreground">
  //               {mediaDetails.releaseDate.substring(0, 4)}
  //             </p>
  //           </div>
  //         </div>
  //         <Button onClick={() => setShowTrackingForm(true)}>
  //           <Plus className="w-4 h-4 mr-2" />
  //           Add to List
  //         </Button>
  //       </div>
  //     </motion.div>

  //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //       {/* Main Content */}
  //       <motion.div
  //         className="lg:col-span-2 space-y-6"
  //         initial={{ opacity: 0 }}
  //         animate={{ opacity: 1 }}
  //         transition={{ delay: 0.2 }}
  //       >
  //         <MediaSynopsis description={mediaDetails.description} />
  //         <MediaCastAndCrew
  //           creators={mediaDetails.creators}
  //           cast={mediaDetails.cast}
  //         />
  //       </motion.div>

  //       {/* Sidebar */}
  //       <motion.div
  //         className="space-y-6"
  //         initial={{ opacity: 0 }}
  //         animate={{ opacity: 1 }}
  //         transition={{ delay: 0.3 }}
  //       >
  //         <MediaInformation media={mediaDetails} />
  //         <SimilarMedia />
  //       </motion.div>
  //     </div>

  //     {/* Tracking Form Modal */}
  //     {showTrackingForm && (
  //       <TrackingForm
  //         mediaId={mediaDetails.id}
  //         mediaTitle={mediaDetails.title}
  //         category={mediaDetails.category}
  //         totalEpisodes={mediaDetails.totalEpisodes}
  //         onClose={() => setShowTrackingForm(false)}
  //       />
  //     )}
  //   </div>
  // );
  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {" "}
      {/* Added padding */}
      <MediaHero
        ref={heroRef}
        media={mediaDetails}
        onAddToList={() => setShowTrackingForm(true)}
      />
      {/* Sticky Nav */}
      <motion.div
        className={cn(
          "sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10 transition-all duration-300",
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Poster Thumbnail */}
            <div className="relative h-10 w-7 rounded overflow-hidden shadow-sm">
              <Image
                src={mediaDetails.posterUrl || "/placeholder.jpg"}
                alt={mediaDetails.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-bold text-sm truncate max-w-[200px]">
                {mediaDetails.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {mediaDetails.releaseDate?.substring(0, 4) || "Unknown"}
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowTrackingForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add to List
          </Button>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MediaSynopsis description={mediaDetails.description} />
          <MediaCastAndCrew
            creators={mediaDetails.creators || []}
            cast={mediaDetails.cast || []}
          />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MediaInformation media={mediaDetails} />
          {/* Note: SimilarMedia requires an API call too, usually passed or fetched inside */}
          <SimilarMedia />
        </motion.div>
      </div>
      {/* Tracking Form Modal */}
      {showTrackingForm && (
        <TrackingForm
          mediaId={mediaDetails.id}
          mediaTitle={mediaDetails.title}
          category={mediaDetails.category} // Ensure this matches Enum
          totalEpisodes={mediaDetails.totalEpisodes}
          posterUrl={mediaDetails.posterUrl} // Pass poster for nice UI in form
          onClose={() => setShowTrackingForm(false)}
        />
      )}
    </div>
  );
}
