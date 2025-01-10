import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchAnimeById, 
  fetchAnimeRecommendations,
  fetchAnimeMoreInfo,
  fetchAnimeCharacters
} from '../api';
import { Star, Calendar, Clock, Info, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatisticsSection } from '../components/anime/StatisticsSection';
import { EpisodesSection } from '../components/anime/EpisodesSection';

export function AnimeDetailsPage() {
  const { id } = useParams();
  const animeId = parseInt(id || '0');
  const [showAllCharacters, setShowAllCharacters] = React.useState(false);

  const { data: anime, isLoading: isLoadingAnime, error: animeError } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => fetchAnimeById(animeId),
    enabled: !!animeId,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', animeId],
    queryFn: () => fetchAnimeRecommendations(animeId),
    enabled: !!animeId,
  });

  const { data: moreInfo = '' } = useQuery({
    queryKey: ['moreInfo', animeId],
    queryFn: async () => {
      const data = await fetchAnimeMoreInfo(animeId);
      return data?.moreinfo || '';
    },
    enabled: !!animeId,
  });

  const { data: charactersData } = useQuery({
    queryKey: ['characters', animeId],
    queryFn: () => fetchAnimeCharacters(animeId),
    enabled: !!animeId,
  });

  const characters = charactersData?.characters || [];
  const displayedCharacters = showAllCharacters ? characters : characters.slice(0, 10);
  const hasMoreCharacters = characters.length > 10;

  if (isLoadingAnime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (animeError || !anime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-red-400">Failed to load anime details</p>
        <Link 
          to="/"
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const animeStats = [
    { icon: Star, label: 'Score', value: anime.score, color: 'text-yellow-500' },
    { icon: Calendar, label: 'Year', value: anime.year, color: 'text-blue-500' },
    { icon: Clock, label: 'Episodes', value: anime.episodes, color: 'text-green-500' },
    { icon: Info, label: 'Status', value: anime.status, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div 
        className="relative h-[50vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${anime.images?.jpg?.large_image_url})`,
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
          {/* Anime Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </motion.div>

          {/* Anime Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 space-y-6"
          >
            <h1 className="text-4xl font-bold">{anime.title}</h1>

            <div className="grid grid-cols-2 gap-4">
              {animeStats.map((stat, index) => {
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
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p>{anime.synopsis}</p>
              
              {moreInfo && (
                <>
                  <h2 className="text-xl font-semibold mb-2 mt-6">Additional Information</h2>
                  <p>{moreInfo}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((genre: any) => (
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

        {/* Statistics and Episodes Sections */}
        <StatisticsSection animeId={animeId} />
        <EpisodesSection animeId={animeId} />

        {/* Characters Section */}
        {characters.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedCharacters.map((character) => (
                <div 
                  key={`character-${character.character.mal_id}`}
                  className="bg-surface/50 rounded-lg p-4 text-center hover:bg-surface/80 transition-colors"
                >
                  <img
                    src={character.character.images.jpg.image_url}
                    alt={character.character.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-3"
                  />
                  <h3 className="font-medium text-sm">{character.character.name}</h3>
                  <p className="text-xs text-white/70">{character.role}</p>
                </div>
              ))}
            </div>
            {hasMoreCharacters && (
              <motion.button
                onClick={() => setShowAllCharacters(!showAllCharacters)}
                className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllCharacters ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    See More Characters <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </motion.section>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.slice(0, 5).map((rec) => (
                <Link 
                  key={`rec-${rec.entry.mal_id}`}
                  to={`/anime/${rec.entry.mal_id}`}
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