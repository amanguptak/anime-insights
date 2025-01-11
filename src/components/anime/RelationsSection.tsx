import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchAnimeRelations } from '../../api/animeDetails';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RelationsSectionProps {
  animeId: number;
}

export function RelationsSection({ animeId }: RelationsSectionProps) {
  const { data: relations = [], isLoading } = useQuery({
    queryKey: ['animeRelations', animeId],
    queryFn: () => fetchAnimeRelations(animeId),
  });

  // Filter relations to only include those with anime entries
  const filteredRelations = relations.filter(relation => 
    relation.entry.some(entry => entry.type === 'anime')
  );

  if (isLoading || !filteredRelations.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6">Related Content</h2>
      
      <div className="grid gap-4">
        {filteredRelations.map((relation: any) => {
          // Filter entries to only include anime
          const animeEntries = relation.entry.filter((entry: any) => entry.type === 'anime');
          
          if (animeEntries.length === 0) return null;

          return (
            <div
              key={relation.relation}
              className={cn(
                "p-4 rounded-xl",
                "bg-surface/30 hover:bg-surface/40",
                "border border-white/5",
                "transition-all duration-300"
              )}
            >
              <h3 className="text-lg font-semibold mb-3 text-white/90">
                {relation.relation}
              </h3>
              <div className="grid gap-3">
                {animeEntries.map((entry: any) => (
                  <Link
                    key={entry.mal_id}
                    to={`/anime/${entry.mal_id}`}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white/70 group-hover:text-white transition-colors truncate">
                        {entry.name}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary" />
                    </div>
                    <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                      Anime
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}