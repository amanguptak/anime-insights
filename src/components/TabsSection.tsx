import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { searchQueryAtom } from '../store/atoms';
import { SearchResultsSection } from './SearchResultsSection';
import { TopAnimeSection } from './TopAnimeSection';
import { TopMangaSection } from './manga/TopMangaSection';
import { RecommendationsGrid } from './RecommendationsGrid';
import { UpcomingAnimeSection } from './UpcomingAnimeSection';
import { ScheduleSection } from './ScheduleSection';
import { SeasonalAnimeSection } from './anime/SeasonalAnimeSection';
import { Trophy, Book, Rocket, Calendar, Search, Heart, Sun, Tag, Shuffle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeGenres, fetchRandomAnime, fetchAnimeByGenre } from '../api';
import { AnimeCard } from './AnimeCard';

export function TabsSection() {
  const [activeTab, setActiveTab] = useState('top-anime');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [randomAnimeList, setRandomAnimeList] = useState<any[]>([]);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const searchQuery = useRecoilValue(searchQueryAtom);

  useEffect(() => {
    if (searchQuery) {
      setActiveTab('search');
    }
  }, [searchQuery]);

  // Fetch genres
  const { data: genres = [] } = useQuery({
    queryKey: ['animeGenres'],
    queryFn: fetchAnimeGenres,
  });

  // Fetch anime by selected genre
  const { data: genreAnime = [] } = useQuery({
    queryKey: ['animeByGenre', selectedGenre],
    queryFn: () => fetchAnimeByGenre(selectedGenre!),
    enabled: !!selectedGenre,
  });

  // Function to fetch random anime
  const fetchRandomAnimeList = async () => {
    setIsLoadingRandom(true);
    try {
      const promises = Array(12).fill(null).map(() => fetchRandomAnime());
      const results = await Promise.all(promises);
      const validResults = results.filter(result => result !== null);
      setRandomAnimeList(validResults);
    } catch (error) {
      console.error('Error fetching random anime:', error);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  // Fetch random anime when tab is selected
  useEffect(() => {
    if (activeTab === 'random' && randomAnimeList.length === 0) {
      fetchRandomAnimeList();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'top-anime', label: 'Top Anime', icon: Trophy },
    { id: 'top-manga', label: 'Top Manga', icon: Book },
    { id: 'seasonal', label: 'Seasonal', icon: Sun },
    { id: 'upcoming', label: 'Upcoming', icon: Rocket },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'genres', label: 'Genres', icon: Tag },
    { id: 'random', label: 'Random', icon: Shuffle },
    { id: 'search', label: 'Search Results', icon: Search },
    { id: 'recommendations', label: 'For You', icon: Heart },
  ];

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
        <div className="relative rounded-3xl p-4 shadow-lg border border-white/10 backdrop-blur-sm bg-white/5">
          <div
            className="absolute -inset-1 z-[-1] rounded-3xl bg-gradient-to-tr from-primary to-purple-500 opacity-20 blur-lg"
            aria-hidden="true"
          />

          <nav className="flex flex-wrap items-center justify-center gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'group relative px-4 py-2 rounded-xl flex items-center gap-2',
                    'text-sm font-medium transition-all duration-300',
                    'hover:scale-[1.05] active:scale-100 focus:outline-none focus:ring-2 focus:ring-white/40',
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-xl shadow-md"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <Icon className={cn(
                    'w-4 h-4 transition-transform duration-300',
                    'group-hover:scale-110'
                  )} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl bg-white/5 border border-white/10 shadow-md backdrop-blur-sm"
        >
          {activeTab === 'top-anime' && <TopAnimeSection />}
          {activeTab === 'top-manga' && <TopMangaSection />}
          {activeTab === 'seasonal' && <SeasonalAnimeSection />}
          {activeTab === 'upcoming' && <UpcomingAnimeSection />}
          {activeTab === 'schedule' && <ScheduleSection />}
          {activeTab === 'search' && <SearchResultsSection />}
          {activeTab === 'recommendations' && <RecommendationsGrid />}
          
          {/* Genres Tab Content */}
          {activeTab === 'genres' && (
            <section className="py-6">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-3 mb-8">
                  {genres.map((genre: any) => (
                    <button
                      key={genre.mal_id}
                      onClick={() => setSelectedGenre(genre.mal_id)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                        selectedGenre === genre.mal_id
                          ? 'bg-primary text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                      )}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>

                {selectedGenre && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {genreAnime.map((anime: any) => (
                      <AnimeCard key={`genre-${anime.mal_id}`} anime={anime} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Random Anime Tab Content */}
          {activeTab === 'random' && (
            <section className="py-6">
              <div className="container mx-auto px-4">
                <div className="flex justify-end mb-6">
                  <button
                    onClick={fetchRandomAnimeList}
                    disabled={isLoadingRandom}
                    className={cn(
                      "px-4 py-2 rounded-xl text-primary transition-colors flex items-center gap-2",
                      isLoadingRandom 
                        ? "bg-primary/10 cursor-not-allowed" 
                        : "bg-primary/20 hover:bg-primary/30"
                    )}
                  >
                    {isLoadingRandom ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Shuffle className="w-4 h-4" />
                    )}
                    {isLoadingRandom ? 'Loading...' : 'Shuffle Again'}
                  </button>
                </div>
                {isLoadingRandom ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {randomAnimeList.map((anime: any, index: number) => (
                      <AnimeCard key={`random-${anime.mal_id}-${index}`} anime={anime} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}