'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Plus, RefreshCw } from 'lucide-react'
import MediaCard from '@/components/ui/MediaCard'
import { MediaCardSkeleton } from '@/components/ui/SkeletonLoader'
import Button from '@/components/ui/Button'
import { Category } from '@/types/tracking.types'

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')

  const categories = [
    { value: 'all', label: 'All' },
    { value: Category.MOVIE, label: 'Movies' },
    { value: Category.SERIES, label: 'Series' },
    { value: Category.ANIME, label: 'Anime' },
    { value: Category.GAME, label: 'Games' },
    { value: Category.BOOK, label: 'Books' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Recommendations</h1>
        </div>
        <p className="text-muted-foreground">Personalized suggestions based on your tracking history</p>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value as Category | 'all')}
          >
            {cat.label}
          </Button>
        ))}
      </motion.div>

      {/* Refresh Button */}
      <motion.div 
        className="flex justify-end mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Recommendations
        </Button>
      </motion.div>

      {/* Recommendations Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="relative group"
          >
            <MediaCard
              id={`rec-${i}`}
              title={`Recommended Title ${i + 1}`}
              category={Object.values(Category)[i % 5]}
              posterUrl=""
              rating={4 + Math.random()}
            />
            
            {/* Quick Add Button */}
            <motion.div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <button className="bg-primary/90 backdrop-blur-sm text-white rounded-full p-2 shadow-lg hover:bg-primary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Recommendation Score */}
            <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-primary">
              {(85 + Math.random() * 15).toFixed(0)}% Match
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}