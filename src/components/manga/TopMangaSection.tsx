import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopManga } from '../../api/manga';
import { MangaCard } from './MangaCard';
import { Pagination } from '../Pagination';
import { cn } from '../../lib/utils';

export function TopMangaSection() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const { data: topManga = [], isLoading } = useQuery({
    queryKey: ['topManga', currentPage],
    queryFn: () => fetchTopManga(currentPage),
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(topManga.length / itemsPerPage);
  const paginatedManga = topManga.slice(0, itemsPerPage);

  return (
    <section className="py-6">
      <div className="container px-4">
        <h2 className={cn(
          'text-2xl font-bold mb-6 text-start',
          'text-gray-900 dark:text-white'
        )}>
          Top Manga
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedManga.map((manga) => (
                <MangaCard key={`top-${manga.mal_id}`} manga={manga} />
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