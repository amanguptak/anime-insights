import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchSeasonalAnime } from '../../api';
import { AnimeCard } from '../AnimeCard';
import { cn } from '../../lib/utils';

const SEASONS = ['winter', 'spring', 'summer', 'fall'];

export function SeasonalAnimeSection() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const [selectedSeason, setSelectedSeason] = React.useState(
    SEASONS[Math.floor(new Date().getMonth() / 3)]
  );

  // Fetch seasonal anime with React Query
  const { data: seasonalAnime = [], isLoading } = useQuery({
    queryKey: ['seasonalAnime', selectedYear, selectedSeason],
    queryFn: () => fetchSeasonalAnime(selectedYear, selectedSeason),
  });

  return (
    <section>
      {/* Container with subtle animation and glass-like background */}
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="">
          {/* Header Row: Title & Selectors */}
          <div className="flex flex-col sm:flex-row py-4 items-center justify-between gap-4">
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              Seasonal Anime
            </motion.h2>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Year Selection */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 rounded-lg bg-surface/50 border border-white/10 
                           hover:bg-surface/70 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>

              {/* Season Selection */}
              <div className="flex gap-2">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={cn(
                      'px-4 py-2 rounded-lg capitalize transition-colors duration-200',
                      selectedSeason === season
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface/50 text-white/70 hover:text-white hover:bg-surface',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50'
                    )}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {seasonalAnime.map((anime: any, index: number) => (
                <AnimeCard
                  key={`${selectedYear}-${selectedSeason}-${anime.mal_id}-${index}`}
                  anime={anime}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
