'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Category, ProgressStatus } from '@/types/tracking.types'

export function FilterSidebar() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ProgressStatus[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {Object.values(Category).map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
                checked={selectedCategories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, category])
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== category))
                  }
                }}
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Status</h4>
        <div className="space-y-2">
          {Object.values(ProgressStatus).map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
                checked={selectedStatuses.includes(status)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStatuses([...selectedStatuses, status])
                  } else {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                  }
                }}
              />
              <span className="text-sm">{status.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                className="text-primary focus:ring-primary"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
              />
              <span className="text-sm">≥ {rating}.0 ⭐</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedCategories([])
          setSelectedStatuses([])
          setSelectedRating(null)
        }}
        className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card-hover rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}