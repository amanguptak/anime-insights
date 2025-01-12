import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeVideos } from '../../api/animeDetails';
import { Play, Film, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VideosSectionProps {
  animeId: number;
}

export function VideosSection({ animeId }: VideosSectionProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['animeVideos', animeId],
    queryFn: () => fetchAnimeVideos(animeId),
  });

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
    setShowWarning(true);
  };

  const handleConfirmNavigation = () => {
    if (selectedVideo) {
      window.open(`https://www.youtube.com/watch?v=${selectedVideo}`, '_blank');
    }
    setShowWarning(false);
    setSelectedVideo(null);
  };

  if (isLoading || (!videos?.promo?.length && !videos?.episodes?.length)) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6">Videos</h2>
      
      {videos.promo?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Film className="w-5 h-5" />
            Promotional Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.promo.map((video: any) => (
              <motion.div
                key={video.trailer.youtube_id}
                className="relative aspect-video rounded-xl overflow-hidden group"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={video.trailer.images.maximum_image_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleVideoClick(video.trailer.youtube_id)}
                    className="p-4 rounded-full bg-primary/80 hover:bg-primary transition-colors"
                  >
                    <Play className="w-8 h-8 fill-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="text-sm font-medium text-white line-clamp-2">
                    {video.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
                You are about to be redirected to YouTube to watch this video. Do you want to continue?
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