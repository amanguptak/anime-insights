import React, { useCallback } from 'react';
import { Search } from 'lucide-react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { searchQueryAtom, searchResultsAtom } from '../store/atoms';
import { fetchAnimeSearch } from '../api';
import { cn } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const setSearchResults = useSetRecoilState(searchResultsAtom);

  const debouncedSearch = useCallback(async (value: string) => {
    if (value.trim().length >= 3) {
      const results = await fetchAnimeSearch(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [setSearchResults]);

  const debouncedSearchHandler = useDebounce(debouncedSearch, 500);

  const handleSearch = (value: string) => {
    setQuery(value);
    debouncedSearchHandler(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-2xl mx-auto"
    >
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search your favorite anime..."
          className={cn(
            'w-full px-6 py-5 pl-14',
            'text-lg text-white',
            'bg-surface/50 backdrop-blur-xl',
            'border-2 border-white/10',
            'rounded-2xl',
            'placeholder-white/50',
            'focus:outline-none focus:border-primary/50',
            'transition-all duration-300',
            'group-hover:border-white/20',
            'group-hover:bg-surface/70'
          )}
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse" />
        </div>
      </div>

      {query && query.length < 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute mt-2 text-sm text-red-400"
        >
          Please enter at least 3 characters
        </motion.p>
      )}
    </motion.div>
  );
}