"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TrackingForm } from "@/components/forms/TrackingForm";
import { Category, ProgressStatus } from "@/types/tracking.types";

export default function MediaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  // Mock data - replace with API call
  const media = {
    id: params.id,
    title: "Example Media Title",
    category: Category.SERIES,
    description:
      "A compelling story that captivates audiences with its intricate plot and character development. This series explores themes of friendship, betrayal, and redemption in a beautifully crafted world.",
    releaseDate: "2024-03-15",
    posterUrl: "",
    backdropUrl: "",
    genres: ["Drama", "Thriller", "Mystery"],
    rating: 4.7,
    totalRatings: 15234,
    episodes: 24,
    status: "Ongoing",
    creators: ["John Doe", "Jane Smith"],
    cast: ["Actor One", "Actor Two", "Actor Three"],
  };

  return (
    <div className="max-w-7xl mx-auto -mt-6">
      {/* Hero Section */}
      <div className="relative h-[450px] -mx-6 mb-8 overflow-hidden">
        {/* Backdrop Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-highlight/10" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-end p-8">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Poster */}
            <motion.div
              className="w-48 h-72 bg-card rounded-lg overflow-hidden flex-shrink-0 shadow-2xl shadow-black/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Play className="w-12 h-12 text-muted-foreground" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  {media.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{media.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-lg">
                  <Star className="w-5 h-5 text-highlight fill-highlight" />
                  <span className="font-semibold">{media.rating}</span>
                  <span className="text-muted-foreground">
                    ({media.totalRatings.toLocaleString()} ratings)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{media.episodes} episodes</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setShowTrackingForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to List
                </Button>
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Description */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed">
              {media.description}
            </p>
          </div>

          {/* Cast & Crew */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Cast & Crew</h2>

            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground mb-2">Creators</h3>
              <div className="flex flex-wrap gap-2">
                {media.creators.map((creator) => (
                  <span
                    key={creator}
                    className="px-3 py-1 bg-card/80 rounded-full text-sm"
                  >
                    {creator}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Main Cast</h3>
              <div className="flex flex-wrap gap-2">
                {media.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 bg-card/80 rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Info Card */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="font-medium">{media.status}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Release Date</dt>
                <dd className="font-medium">{media.releaseDate}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Episodes</dt>
                <dd className="font-medium">{media.episodes}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Genres</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {media.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-0.5 bg-primary/20 text-primary-foreground rounded text-xs font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Similar Content */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Similar Content</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 p-2 -m-2 rounded-lg hover:bg-card-hover/50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-18 bg-card rounded flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">
                      Related Title {i}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Series • 2024
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tracking Form Modal */}
      {showTrackingForm && (
        <TrackingForm
          mediaId={media.id}
          mediaTitle={media.title}
          category={media.category}
          totalEpisodes={media.episodes}
          onClose={() => setShowTrackingForm(false)}
        />
      )}
    </div>
  );
}
