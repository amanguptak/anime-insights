import React from 'react';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { searchQueryAtom, searchResultsAtom } from '../store/atoms';
import { AnimeCard } from './AnimeCard';
import { cn } from '../lib/utils';

export function SearchResultsSection() {
  const searchQuery = useRecoilValue(searchQueryAtom);
  const searchResults = useRecoilValue(searchResultsAtom);

  if (!searchQuery || searchQuery.length < 3) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Enter at least 3 characters to search for anime
        </p>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No results found for "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2
          className={cn(
            'text-2xl font-bold mb-6 text-start',
            'text-gray-900 dark:text-white'
          )}
        >
          Search Results for "{searchQuery}"
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResults.map((anime) => (
            <AnimeCard
              key={`search-result-${anime.mal_id}-${Date.now()}`}
              anime={anime}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
