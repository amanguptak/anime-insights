import React from 'react';
import { motion } from 'framer-motion';
import { AnimeCard } from './AnimeCard';
import { cn } from '../lib/utils';

interface RecommendationsSectionProps {
  recommendations: any[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  if (!recommendations.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className={cn(
        'text-2xl font-bold mb-6',
        'text-gray-900 dark:text-white'
      )}>
        Recommended Anime
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((rec) => (
          <AnimeCard
            key={`rec-${rec.entry.mal_id}`}
            anime={rec.entry}
          />
        ))}
      </div>
    </motion.section>
  );
}