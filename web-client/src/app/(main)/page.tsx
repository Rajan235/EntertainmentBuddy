'use client'

import { motion } from 'framer-motion'
import { Search, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import MediaCard from '@/components/ui/MediaCard'
import { MediaCardSkeleton } from '@/components/ui/SkeletonLoader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTracking } from '@/hooks/useTracking'
import { Category, ProgressStatus } from '@/types/tracking.types'

export default function DashboardPage() {
  const { recentEntries, plannedEntries, completedCount, isLoading } = useTracking()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="text-gradient">User</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Continue tracking your entertainment journey
        </p>
      </motion.div>

      {/* Quick Search */}
      <motion.div 
        className="glass rounded-xl p-6 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Quick search for movies, series, games..."
              className="pl-10"
            />
          </div>
          <Button>Search</Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="glass rounded-xl p-6 border border-primary/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">In Progress</p>
              <p className="text-3xl font-bold text-primary">12</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/50" />
          </div>
        </motion.div>

        <motion.div 
          className="glass rounded-xl p-6 border border-accent/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Planning</p>
              <p className="text-3xl font-bold text-accent">24</p>
            </div>
            <Clock className="w-8 h-8 text-accent/50" />
          </div>
        </motion.div>

        <motion.div 
          className="glass rounded-xl p-6 border border-green-500/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-500">{completedCount || 48}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500/50" />
          </div>
        </motion.div>
      </motion.div>

      {/* Recently Updated */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Updated</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <MediaCard
                key={i}
                id={`media-${i}`}
                title="Example Media Title"
                category={Category.SERIES}
                status={ProgressStatus.IN_PROGRESS}
                rating={4.5}
                posterUrl=""
                progress={7}
                totalEpisodes={12}
              />
            ))
          )}
        </div>
      </motion.section>

      {/* Planning Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Planning to Watch</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <MediaCard
                key={i}
                id={`planned-${i}`}
                title="Planned Media"
                category={Category.MOVIE}
                status={ProgressStatus.PLANNING}
                posterUrl=""
              />
            ))
          )}
        </div>
      </motion.section>
    </motion.div>
  )
}