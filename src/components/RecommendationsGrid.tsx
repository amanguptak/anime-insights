import React from 'react';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { searchResultsAtom } from '../store/atoms';
import { fetchAnimeRecommendations } from '../api';
import { AnimeCard } from './AnimeCard';
import { Pagination } from './Pagination';
import { cn } from '../lib/utils';

export function RecommendationsGrid() {
  const searchResults = useRecoilValue(searchResultsAtom);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', searchResults[0]?.mal_id],
    queryFn: () => fetchAnimeRecommendations(searchResults[0]?.mal_id),
    enabled: searchResults.length > 0,
  });

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Search for an anime to see recommendations
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const paginatedRecommendations = recommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 p-5">
      <h2
        className={cn(
          'text-2xl font-bold mb-6 text-start',
          'text-gray-900 dark:text-white'
        )}
      >
        Recommendations based on "{searchResults[0]?.title}"
      </h2>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {paginatedRecommendations.map((rec) => (
          <AnimeCard key={`rec-${rec.entry.mal_id}`} anime={rec.entry} />
        ))}
      </motion.div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
