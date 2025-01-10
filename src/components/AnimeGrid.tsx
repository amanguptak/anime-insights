import React from 'react';
import { useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AnimeCard } from './AnimeCard';
import { searchQueryAtom } from '../store/atoms';
import { fetchAnimeSearch, fetchTopAnime } from '../api';

export function AnimeGrid() {
  const searchQuery = useRecoilValue(searchQueryAtom);

  const { data: topAnime = [] } = useQuery({
    queryKey: ['topAnime'],
    queryFn: fetchTopAnime,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['searchAnime', searchQuery],
    queryFn: () => fetchAnimeSearch(searchQuery),
    enabled: searchQuery.length >= 3,
  });

  const displayedAnime = searchQuery ? searchResults : topAnime;

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
    >
      <AnimatePresence mode="wait">
        {displayedAnime.map((anime) => (
          <AnimeCard 
            key={`${anime.mal_id}-${anime.title}`} 
            anime={anime} 
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}