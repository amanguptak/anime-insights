import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeEpisodes } from '../../api';
import { Pagination } from '../Pagination';
import { Calendar, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EpisodesSectionProps {
  animeId: number;
}

/**
 * Optional SkeletonCard component for a more subtle loading state
 * when switching between pages. It simulates the shape of an episode card.
 */
function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "animate-pulse",
        "bg-surface/30 border border-white/5 rounded-xl p-4"
      )}
    >
      <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
      <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
    </motion.div>
  );
}

export function EpisodesSection({ animeId }: EpisodesSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showAllEpisodes, setShowAllEpisodes] = React.useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['animeEpisodes', animeId, currentPage],
    queryFn: () => fetchAnimeEpisodes(animeId, currentPage),
    // You can also set `keepPreviousData: true` for an even smoother pagination experience
    // keepPreviousData: true
  });

  // Destructure data for convenience and apply safe defaults
  const {
    data: episodes = [],
    pagination = { last_visible_page: 1 },
  } = data || {};

  const totalPages = pagination.last_visible_page;

  // Decide which episodes to show
  const displayedEpisodes = React.useMemo(() => {
    return showAllEpisodes ? episodes : episodes.slice(0, 5);
  }, [episodes, showAllEpisodes]);

  /**
   * 1) Show Full Loader if data is loading initially.
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2) If no episodes, just return null
  if (!episodes.length) {
    return null;
  }

  const hasMoreEpisodes = episodes.length > 5;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6">Episodes</h2>

      <div className="space-y-4 relative">
        {/**
         * 2) Partial/Skeleton Loader when switching pages (isFetching) 
         *    so the user still sees existing data with a subtle loader
         */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {isFetching
              ? // If we are fetching new data, show skeleton cards (optional approach)
                Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={`skeleton-${idx}`} />
                ))
              : // Otherwise, show the actual episodes
                displayedEpisodes.map((episode: any, index: number) => (
                  <motion.div
                    key={`episode-${episode.mal_id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn(
                      "group relative overflow-hidden",
                      "bg-surface/30 hover:bg-surface/50",
                      "border border-white/5 hover:border-primary/20",
                      "rounded-xl transition-all duration-300"
                    )}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-medium">
                            {episode.mal_id}
                          </span>
                          <h3 className="text-lg font-medium truncate flex-1">
                            {episode.title}
                          </h3>
                        </div>

                        {episode.title_japanese && (
                          <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                            {episode.title_japanese}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          {episode.aired && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(episode.aired).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {episode.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{episode.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Filler label on bottom-right */}
                      {episode.filler && (
                        <span className="absolute bottom-4 right-4 px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded">
                          Filler Episode
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Show pagination controls */}
      <div className="mt-8 space-y-6">
        {hasMoreEpisodes && (
          <div className="flex justify-center">
            <motion.button
              onClick={() => setShowAllEpisodes((prev) => !prev)}
              className={cn(
                "group flex items-center gap-2 px-6 py-3 rounded-xl",
                "text-sm font-medium transition-all duration-300",
                "bg-primary/10 hover:bg-primary/20",
                "border border-primary/20 hover:border-primary/40",
                "text-primary"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showAllEpisodes ? (
                <>
                  <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  Show Less Episodes
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                  Show All Episodes
                </>
              )}
            </motion.button>
          </div>
        )}

        {showAllEpisodes && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              // Switch page and reset to partial loader
              setCurrentPage(page);
            }}
          />
        )}
      </div>
    </motion.section>
  );
}
