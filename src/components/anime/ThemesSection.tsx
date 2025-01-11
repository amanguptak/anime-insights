import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeThemes } from '../../api/animeDetails';
import { Music, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ThemesSectionProps {
  animeId: number;
}

export function ThemesSection({ animeId }: ThemesSectionProps) {
  const [showAllOpenings, setShowAllOpenings] = useState(false);
  const [showAllEndings, setShowAllEndings] = useState(false);

  const { data: themes, isLoading } = useQuery({
    queryKey: ['animeThemes', animeId],
    queryFn: () => fetchAnimeThemes(animeId),
  });

  if (isLoading || (!themes?.openings?.length && !themes?.endings?.length)) return null;

  const displayedOpenings = showAllOpenings ? themes.openings : themes.openings?.slice(0, 2);
  const displayedEndings = showAllEndings ? themes.endings : themes.endings?.slice(0, 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6">Theme Songs</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {themes.openings?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Opening Themes
            </h3>
            <div className="space-y-3">
              {displayedOpenings.map((theme: string, index: number) => (
                <motion.div
                  key={`opening-${index}`}
                  className={cn(
                    "p-4 rounded-xl",
                    "bg-surface/30 hover:bg-surface/50",
                    "border border-white/5",
                    "transition-all duration-300"
                  )}
                  whileHover={{ scale: 1.01 }}
                >
                  <span className="text-sm font-medium">
                    Opening {index + 1}: {theme}
                  </span>
                </motion.div>
              ))}
            </div>
            {themes.openings.length > 2 && (
              <motion.button
                onClick={() => setShowAllOpenings(!showAllOpenings)}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllOpenings ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    See More Openings <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        )}

        {themes.endings?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Ending Themes
            </h3>
            <div className="space-y-3">
              {displayedEndings.map((theme: string, index: number) => (
                <motion.div
                  key={`ending-${index}`}
                  className={cn(
                    "p-4 rounded-xl",
                    "bg-surface/30 hover:bg-surface/50",
                    "border border-white/5",
                    "transition-all duration-300"
                  )}
                  whileHover={{ scale: 1.01 }}
                >
                  <span className="text-sm font-medium">
                    Ending {index + 1}: {theme}
                  </span>
                </motion.div>
              ))}
            </div>
            {themes.endings.length > 2 && (
              <motion.button
                onClick={() => setShowAllEndings(!showAllEndings)}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllEndings ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    See More Endings <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}