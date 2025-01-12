import { motion } from 'framer-motion';
import { Book, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface MangaCardProps {
  manga: {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
    score: number;
    chapters: number;
    volumes: number;
  };
}

export function MangaCard({ manga }: MangaCardProps) {
  return (
    <Link to={`/manga/${manga.mal_id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group relative w-full aspect-[3/4]"
      >
        <div className="relative h-full overflow-hidden rounded-xl glassmorphic">
          <img
            src={manga.images.jpg.image_url}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="glassmorphic rounded-lg p-3 space-y-2">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {manga.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    {manga.score || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Book className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">
                    {manga.chapters || '?'} Ch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}