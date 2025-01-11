import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopAnime } from '../api';
import { AnimeCard } from './AnimeCard';
import { Pagination } from './Pagination';
import { cn } from '../lib/utils';

export function TopAnimeSection() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const { data: topAnime = [], isLoading } = useQuery({
    queryKey: ['topAnime', currentPage],
    queryFn: () => fetchTopAnime(currentPage),
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(topAnime.length / itemsPerPage);
  const paginatedAnime = topAnime.slice(0, itemsPerPage);

  return (
    <section className="py-6">
      <div className="container  px-4">
        <h2
          className={cn(
            'text-2xl font-bold mb-6 text-start',
            'text-gray-900 dark:text-white'
          )}
        >
          Trending Anime
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedAnime.map((anime) => (
                <AnimeCard key={`top-${anime.mal_id}`} anime={anime} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
