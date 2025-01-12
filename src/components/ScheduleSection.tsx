import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSchedules } from '../api';
import { AnimeCard } from './AnimeCard';
import { cn } from '../lib/utils';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function ScheduleSection() {
  const [selectedDay, setSelectedDay] = React.useState(
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  );

  const { data: scheduleData = [], isLoading } = useQuery({
    queryKey: ['schedule', selectedDay],
    queryFn: () => fetchSchedules(selectedDay),
    keepPreviousData: true,
  });

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Anime Schedule</h2>
        </div>

        {/* Days Selection */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 glassmorphic rounded-xl p-2">
          {DAYS.map((day) => (
            <button
              key={`day-${day}`}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all',
                selectedDay === day
                  ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              {day}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : scheduleData.length === 0 ? (
          <div className="text-center py-12 glassmorphic rounded-xl">
            <p className="text-white/70">No anime scheduled for {selectedDay}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {scheduleData.map((anime, index) => (
              <AnimeCard 
                key={`schedule-${selectedDay}-${anime.mal_id}-${index}`} 
                anime={anime} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}