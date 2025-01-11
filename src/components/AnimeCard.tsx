import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface AnimeCardProps {
  anime: {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
    score: number;
  };
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link to={`/anime/${anime.mal_id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group relative w-full aspect-[3/4]"
      >
        <div className="relative h-full overflow-hidden rounded-xl glassmorphic neon-border">
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="glassmorphic rounded-lg p-3 space-y-2">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {anime.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    {anime.score || 'N/A'}
                  </span>
                </div>
                <Heart className="w-5 h-5 text-red-500 transition-transform duration-300 group-hover:scale-125" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}