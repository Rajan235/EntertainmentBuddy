"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Plus, Star, Clock, Film, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackingForm } from "@/components/forms/TrackingForm";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Mock data - replace with API call
  const media = {
    id: params.id,
    title: "Shōgun",
    category: Category.SERIES,
    description:
      "In 1600s Japan, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him, when a mysterious European ship is found marooned in a nearby fishing village.",
    releaseDate: "2024-02-27",
    posterUrl: "/mock/shogun.jpg",
    backdropUrl: "/mock/shogun-backdrop.jpg",
    genres: ["Drama", "Thriller", "Mystery"],
    rating: 4.7,
    totalRatings: 15234,
    episodes: 24,
    status: "Ongoing",
    creators: ["John Doe", "Jane Smith"],
    cast: ["Actor One", "Actor Two", "Actor Three"],
  };

  return (
    <div className="max-w-7xl mx-auto">
      <MediaHero
        ref={heroRef}
        media={media}
        onAddToList={() => setShowTrackingForm(true)}
      />

      {/* Sticky Nav */}
      <motion.div
        className={cn(
          "sticky top-16 z-20 -mx-8 mb-8 bg-background/80 backdrop-blur-lg border-b border-border transition-all",
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
        aria-hidden={!isScrolled}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Image
              src={media.posterUrl}
              alt={media.title}
              width={40}
              height={60}
              className="rounded-md"
            />
            <div>
              <h2 className="font-bold text-lg">{media.title}</h2>
              <p className="text-sm text-muted-foreground">
                {media.releaseDate.substring(0, 4)}
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
          <MediaSynopsis description={media.description} />
          <MediaCastAndCrew creators={media.creators} cast={media.cast} />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MediaInformation media={media} />
          <SimilarMedia />
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

const MediaHero = (0,
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
  "forwardRef"
])(({ media, onAddToList }, ref) => (
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
              <span className="text-sm">{media.episodes} episodes</span>
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
));
MediaHero.displayName = "MediaHero";

function MediaSynopsis({ description }) {
  return (
    <Card id="synopsis">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-5 h-5" /> Synopsis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function MediaCastAndCrew({ creators, cast }) {
  return (
    <Card id="cast">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" /> Cast & Crew
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Creators
          </h3>
          <div className="flex flex-wrap gap-2">
            {creators.map((creator) => (
              <Badge key={creator} variant="secondary">
                {creator}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Main Cast
          </h3>
          <div className="flex flex-wrap gap-2">
            {cast.map((actor) => (
              <Badge key={actor} variant="secondary">
                {actor}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MediaInformation({ media }) {
  return (
    <Card id="info">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" /> Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
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
            <dd className="flex flex-wrap gap-1.5 mt-1">
              {media.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function SimilarMedia() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3 p-2 -m-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="w-12 h-18 bg-secondary rounded flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm line-clamp-1">
                Related Title {i}
              </p>
              <p className="text-xs text-muted-foreground">Series • 2024</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
