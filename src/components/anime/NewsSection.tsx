import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeNews } from '../../api/animeDetails';
import { Calendar, ExternalLink, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NewsSectionProps {
  animeId: number;
}

export function NewsSection({ animeId }: NewsSectionProps) {
  const [showAllNews, setShowAllNews] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['animeNews', animeId],
    queryFn: () => fetchAnimeNews(animeId),
  });

  const handleNewsClick = (newsItem: any) => {
    setSelectedNews(newsItem);
    setShowWarning(true);
  };

  const handleConfirmNavigation = () => {
    if (selectedNews) {
      window.open(selectedNews.url, '_blank');
    }
    setShowWarning(false);
    setSelectedNews(null);
  };

  const displayedNews = showAllNews ? news : news.slice(0, 2);

  if (isLoading || news.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6">Latest News</h2>
      <div className="grid gap-4">
        {displayedNews.map((item: any) => (
          <motion.button
            key={item.mal_id}
            onClick={() => handleNewsClick(item)}
            className={cn(
              "w-full text-left",
              "group p-4 rounded-xl",
              "bg-surface/30 hover:bg-surface/50",
              "border border-white/5 hover:border-primary/20",
              "transition-all duration-300"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  Read More
                </span>
              </div>
              {item.excerpt && (
                <p className="text-sm text-white/70 line-clamp-2 mt-2">
                  {item.excerpt}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {news.length > 2 && (
        <motion.button
          onClick={() => setShowAllNews(!showAllNews)}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAllNews ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              See More News <ChevronDown className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface p-6 rounded-xl max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">External Link Warning</h3>
                <button
                  onClick={() => setShowWarning(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/70 mb-6">
                You are about to leave this site and visit an external website. Do you want to continue?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmNavigation}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}