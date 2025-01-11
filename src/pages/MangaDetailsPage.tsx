import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchMangaById, fetchMangaRecommendations } from '../api/manga';
import { Star, Calendar, Book, Info, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function MangaDetailsPage() {
  const { id } = useParams();
  const mangaId = parseInt(id || '0');

  const { data: manga, isLoading: isLoadingManga } = useQuery({
    queryKey: ['manga', mangaId],
    queryFn: () => fetchMangaById(mangaId),
    enabled: !!mangaId,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['mangaRecommendations', mangaId],
    queryFn: () => fetchMangaRecommendations(mangaId),
    enabled: !!mangaId,
  });

  if (isLoadingManga) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-red-400">Failed to load manga details</p>
        <Link 
          to="/"
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const mangaStats = [
    { icon: Star, label: 'Score', value: manga.score, color: 'text-yellow-500' },
    { icon: Calendar, label: 'Published', value: manga.published?.string, color: 'text-blue-500' },
    { icon: Book, label: 'Chapters', value: manga.chapters, color: 'text-green-500' },
    { icon: Info, label: 'Status', value: manga.status, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div 
        className="relative h-[50vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${manga.images?.jpg?.large_image_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <Link 
          to="/"
          className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Manga Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <img
              src={manga.images.jpg.large_image_url}
              alt={manga.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </motion.div>

          {/* Manga Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 space-y-6"
          >
            <h1 className="text-4xl font-bold">{manga.title}</h1>

            <div className="grid grid-cols-2 gap-4">
              {mangaStats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={`stat-${index}`} className="flex items-center gap-2">
                    <StatIcon className={cn('h-5 w-5', stat.color)} />
                    <span>{stat.label}: {stat.value || 'N/A'}</span>
                  </div>
                );
              })}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p>{manga.synopsis}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {manga.genres?.map((genre: any) => (
                <span
                  key={`genre-${genre.mal_id}`}
                  className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Similar Manga</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.slice(0, 5).map((rec) => (
                <Link 
                  key={`rec-${rec.entry.mal_id}`}
                  to={`/manga/${rec.entry.mal_id}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden group">
                    <img
                      src={rec.entry.images.jpg.image_url}
                      alt={rec.entry.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white text-sm font-medium line-clamp-2">
                          {rec.entry.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}