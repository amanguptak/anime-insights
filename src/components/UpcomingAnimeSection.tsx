import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingAnime } from '../api';
import { AnimeCard } from './AnimeCard';
import { Pagination } from './Pagination';
import { cn } from '../lib/utils';

export function UpcomingAnimeSection() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const { data: upcomingAnime = [], isLoading } = useQuery({
    queryKey: ['upcomingAnime', currentPage],
    queryFn: () => fetchUpcomingAnime(currentPage),
    keepPreviousData: true,
    select: (data) =>
      data.map((anime, index) => ({
        ...anime,
        uniqueId: `${anime.mal_id}-${index}`,
      })),
  });

  const totalPages = Math.ceil(upcomingAnime.length / itemsPerPage);
  const paginatedAnime = upcomingAnime.slice(0, itemsPerPage);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2
          className={cn(
            'text-2xl font-bold mb-6 text-start',
            'text-gray-900 dark:text-white'
          )}
        >
          Upcoming Anime
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedAnime.map((anime) => (
                <AnimeCard key={anime.uniqueId} anime={anime} />
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
