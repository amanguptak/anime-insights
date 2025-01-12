import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { TopAnimeSection } from '../components/TopAnimeSection';
import { TopMangaSection } from '../components/manga/TopMangaSection';
import { SeasonalAnimeSection } from '../components/anime/SeasonalAnimeSection';
import { UpcomingAnimeSection } from '../components/UpcomingAnimeSection';
import { ScheduleSection } from '../components/ScheduleSection';
import { SearchResultsSection } from '../components/SearchResultsSection';
import { RecommendationsGrid } from '../components/RecommendationsGrid';
import { useRecoilValue } from 'recoil';
import { searchQueryAtom } from '../store/atoms';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeGenres, fetchRandomAnime, fetchAnimeByGenre } from '../api';
import { AnimeCard } from '../components/AnimeCard';
import {
  TrendingUpIcon,
  Book,
  Cloud,
  Rocket,
  Calendar,
  Search,
  Heart,
  Tag,
  Shuffle,
  Loader2,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/ThemeToggle';

export function HomePage() {
  const [activeSection, setActiveSection] = useState('trending');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [randomAnimeList, setRandomAnimeList] = useState<any[]>([]);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchQuery = useRecoilValue(searchQueryAtom);

  const { data: genres = [] } = useQuery({
    queryKey: ['animeGenres'],
    queryFn: fetchAnimeGenres,
  });

  const { data: genreAnime = [] } = useQuery({
    queryKey: ['animeByGenre', selectedGenre],
    queryFn: () => fetchAnimeByGenre(selectedGenre!),
    enabled: !!selectedGenre,
  });

  const fetchRandomAnimeList = async () => {
    setIsLoadingRandom(true);
    try {
      const promises = Array(12)
        .fill(null)
        .map(() => fetchRandomAnime());
      const results = await Promise.all(promises);
      const validResults = results.filter((result) => result !== null);
      setRandomAnimeList(validResults);
    } catch (error) {
      console.error('Error fetching random anime:', error);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'random' && randomAnimeList.length === 0) {
      fetchRandomAnimeList();
    }
  }, [activeSection]);

  useEffect(() => {
    if (searchQuery) {
      setActiveSection('search');
      setShowSearch(true);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        const inputElement = document.getElementById(
          'searchbar-input'
        ) as HTMLInputElement | null;
        if (inputElement) {
          inputElement.focus();
        }
      }, 0);
    }
  }, [showSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSearch && e.key === 'Enter') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { id: 'trending', label: 'Trending Anime', icon: TrendingUpIcon },
    { id: 'top-manga', label: 'Top Manga', icon: Book },
    { id: 'seasonal', label: 'Seasonal', icon: Cloud },
    { id: 'upcoming', label: 'Upcoming', icon: Rocket },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'genres', label: 'Genres', icon: Tag },
    { id: 'random', label: 'Random', icon: Shuffle },
    { id: 'recommendations', label: 'For You', icon: Heart },
  ];

  const handleNavigation = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface/80 backdrop-blur-lg border border-white/10 md:hidden"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 bg-surface/80 backdrop-blur-lg border-r border-white/10 md:hidden"
            >
              <div className="p-4 flex justify-between items-center border-b border-white/10">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={cn(
                        'w-full p-3 rounded-xl flex items-center gap-3',
                        'transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                          : 'hover:bg-white/10 text-white/70 hover:text-white'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    setShowSearch(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <motion.div
        className={cn(
          'fixed left-4 top-4 bottom-4 z-50',
          'bg-surface/80 backdrop-blur-lg',
          'rounded-2xl shadow-xl',
          'border border-white/10',
          'flex flex-col p-2',
          'hidden md:flex' // Hide on mobile, show on desktop
        )}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex-1 flex flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div key={item.id} className="relative group">
                <motion.button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'w-full p-3 rounded-xl',
                    'transition-all duration-300',
                    'flex items-center justify-center',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                      : 'hover:bg-white/10 text-white/70 hover:text-white'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>

                <div
                  className={cn(
                    'absolute left-[120%] top-1/2 -translate-y-1/2',
                    'px-3 py-1.5 rounded-lg',
                    'bg-gray-900/90 backdrop-blur-sm',
                    'text-sm text-white font-medium',
                    'whitespace-nowrap',
                    'opacity-0 invisible -translate-x-2',
                    'group-hover:opacity-100 group-hover:visible group-hover:translate-x-0',
                    'transition-all duration-200',
                    'z-[60]',
                    'border border-white/10',
                    'shadow-lg'
                  )}
                >
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-l border-b border-white/10" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative group">
          <motion.button
            onClick={() => setShowSearch(!showSearch)}
            className={cn(
              'w-full p-3 rounded-xl mt-2',
              'transition-all duration-300',
              'flex items-center justify-center',
              showSearch
                ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>

          <div
            className={cn(
              'absolute left-[120%] top-1/2 -translate-y-1/2',
              'px-3 py-1.5 rounded-lg',
              'bg-gray-900/90 backdrop-blur-sm',
              'text-sm text-white font-medium',
              'whitespace-nowrap',
              'opacity-0 invisible -translate-x-2',
              'group-hover:opacity-100 group-hover:visible group-hover:translate-x-0',
              'transition-all duration-200',
              'z-[60]',
              'border border-white/10',
              'shadow-lg'
            )}
          >
            Search
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-l border-b border-white/10" />
          </div>
        </div>
      </motion.div>

      {/* Hero / Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pt-10 md:pb-2 lg:pt-20 lg:pb-5 text-center"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="text-sm md:text-base font-semibold text-gray-500 dark:text-gray-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Gateway to the Anime Universe
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover Stories That
            <br />
            <span className="text-blue-500 dark:text-blue-400">
              Inspire
            </span> & <ThemeToggle />
            <span className="text-purple-500 dark:text-purple-400 ml-1">
              Captivate
            </span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Explore a world of handpicked anime series and movies tailored to
            your unique taste.
          </motion.p>
        </div>
      </motion.div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-x-0 top-0 z-[9999] bg-background/95 backdrop-blur-lg shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Search Anime</h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pl-4 md:pl-24 pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="py-8"
          >
            {activeSection === 'trending' && <TopAnimeSection />}
            {activeSection === 'top-manga' && <TopMangaSection />}
            {activeSection === 'seasonal' && <SeasonalAnimeSection />}
            {activeSection === 'upcoming' && <UpcomingAnimeSection />}
            {activeSection === 'schedule' && <ScheduleSection />}
            {activeSection === 'search' && <SearchResultsSection />}
            {activeSection === 'recommendations' && <RecommendationsGrid />}

            {activeSection === 'genres' && (
              <section className="container mx-auto space-y-8">
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                  <div className="w-full md:w-auto">
                    <div className="flex flex-wrap md:justify-center gap-3">
                      {genres.map((genre: any, index: number) => {
                        // Define unique colors for each genre
                        const textColorMap = [
                          'text-red-300',
                          'text-blue-300',
                          'text-green-300',
                          'text-yellow-300',
                          'text-purple-300',
                          'text-rose-300',
                          'text-teal-300',
                          'text-cyan-300',
                          'text-indigo-300',
                          'text-amber-300',
                        ];
                        const textColor =
                          textColorMap[index % textColorMap.length]; // Rotate colors if more genres exist

                        return (
                          <button
                            key={genre.mal_id}
                            onClick={() => setSelectedGenre(genre.mal_id)}
                            className={cn(
                              'px-4 py-1 text-xs font-semibold rounded-lg transition-all duration-300 focus:outline-none whitespace-nowrap relative overflow-hidden backdrop-blur-md',
                              selectedGenre === genre.mal_id
                                ? 'bg-orange-500/90 text-white shadow-lg scale-105 dark:bg-indigo-800'
                                : `bg-white/10 hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 shadow-md ${textColor}`
                            )}
                            style={{
                              boxShadow:
                                selectedGenre === genre.mal_id
                                  ? '0px 4px 20px rgba(255, 122, 0, 0.6)' // Glow for selected
                                  : '0px 2px 10px rgba(0, 0, 0, 0.15)', // Subtle shadow for unselected
                            }}
                          >
                            {/* Gradient Overlay for Glass Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 dark:from-gray-700/20 dark:via-gray-800/10 dark:to-gray-900/20 pointer-events-none"></div>

                            {/* Genre Name */}
                            <span className="relative z-10">{genre.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {selectedGenre && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {genreAnime.map((anime: any) => (
                      <AnimeCard key={`genre-${anime.mal_id}`} anime={anime} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeSection === 'random' && (
              <section className="container mx-auto space-y-8">
                <div className="flex justify-end">
                  <button
                    onClick={fetchRandomAnimeList}
                    disabled={isLoadingRandom}
                    className={cn(
                      'px-6 py-3 rounded-xl',
                      'flex items-center gap-2',
                      'transition-all duration-300',
                      isLoadingRandom
                        ? 'bg-primary/10 cursor-not-allowed'
                        : 'bg-primary/20 hover:bg-primary/30'
                    )}
                  >
                    {isLoadingRandom ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Shuffle className="w-5 h-5" />
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
                      <AnimeCard
                        key={`random-${anime.mal_id}-${index}`}
                        anime={anime}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
