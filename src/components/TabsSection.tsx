import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { searchQueryAtom } from '../store/atoms';
import { SearchResultsSection } from './SearchResultsSection';
import { TopAnimeSection } from './TopAnimeSection';
import { RecommendationsGrid } from './RecommendationsGrid';
import { UpcomingAnimeSection } from './UpcomingAnimeSection';
import { ScheduleSection } from './ScheduleSection';
import { SeasonalAnimeSection } from './anime/SeasonalAnimeSection';
import { Trophy, Rocket, Calendar, Search, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

export function TabsSection() {
  const [activeTab, setActiveTab] = useState('top');
  const searchQuery = useRecoilValue(searchQueryAtom);

  useEffect(() => {
    if (searchQuery) {
      setActiveTab('search');
    }
  }, [searchQuery]);

  const tabs = [
    { id: 'top', label: 'Trending', icon: Trophy },
    { id: 'upcoming', label: 'Upcoming', icon: Rocket },
    { id: 'seasonal', label: 'Seasonal', icon: Calendar },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'search', label: 'Search Results', icon: Search },
    { id: 'recommendations', label: 'For You', icon: Heart },
  ];

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Updated Glassmorphic Navigation Container */}
        <div className="relative rounded-3xl p-4 shadow-lg border border-white/10 backdrop-blur-sm bg-white/5">
          {/* Optional decorative gradient behind the tabs for a fresher look */}
          <div
            className="absolute -inset-1 z-[-1] rounded-3xl bg-gradient-to-tr from-primary to-purple-500 opacity-20 blur-lg"
            aria-hidden="true"
          />

          <nav
            className="flex flex-wrap items-center justify-center gap-3"
            aria-label="Tabs"
          >
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
                  {/* Animated background for the active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-xl shadow-md"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {/* Slight icon pop on hover */}
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      'group-hover:scale-110'
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Animated Content Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl bg-white/5 border border-white/10 shadow-md backdrop-blur-sm"
        >
          {activeTab === 'top' && <TopAnimeSection />}
          {activeTab === 'upcoming' && <UpcomingAnimeSection />}
          {activeTab === 'seasonal' && <SeasonalAnimeSection />}
          {activeTab === 'schedule' && <ScheduleSection />}
          {activeTab === 'search' && <SearchResultsSection />}
          {activeTab === 'recommendations' && <RecommendationsGrid />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
