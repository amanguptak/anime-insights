import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeStatistics } from '../../api';
import { cn } from '../../lib/utils';

interface StatisticsSectionProps {
  animeId: number;
}

export function StatisticsSection({ animeId }: StatisticsSectionProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['animeStats', animeId],
    queryFn: () => fetchAnimeStatistics(animeId),
  });

  if (isLoading || !stats) return null;

  const totalVotes = Object.values(stats.scores).reduce((acc: number, curr: any) => acc + curr.votes, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 p-6 glassmorphic rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-6">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Watching Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Watching Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Watching', value: stats.watching },
              { label: 'Completed', value: stats.completed },
              { label: 'On Hold', value: stats.on_hold },
              { label: 'Dropped', value: stats.dropped },
              { label: 'Plan to Watch', value: stats.plan_to_watch }
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-200">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / stats.total) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="text-sm text-gray-300">{value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
          <div className="space-y-2">
            {Object.entries(stats.scores).reverse().map(([score, data]: [string, any]) => (
              <div key={score} className="flex items-center gap-3">
                <span className="w-6 text-right">{score}</span>
                <div className="flex-1 h-6 bg-gray-700 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.votes / totalVotes) * 100}%` }}
                    className={cn(
                      "h-full",
                      parseInt(score) >= 8 ? "bg-green-500" :
                      parseInt(score) >= 6 ? "bg-yellow-500" :
                      "bg-red-500"
                    )}
                  />
                </div>
                <span className="text-sm text-gray-300 w-20">
                  {((data.votes / totalVotes) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}