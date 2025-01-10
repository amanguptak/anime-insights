import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { TabsSection } from '../components/TabsSection';
import { Sparkles, Sun, Moon } from 'lucide-react';

export function HomePage() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white'
          : 'bg-gradient-to-b from-gray-100 via-gray-50 to-white text-gray-900'
      }`}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 md:py-32 text-center"
      >
        {/* Header Text */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          {/* Tagline */}
          <motion.div
            className="text-base font-semibold text-gray-500 dark:text-gray-400 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Gateway to the Anime Universe
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover Stories That
            <br />
            <span className="text-blue-500 dark:text-blue-400">
              Inspire
            </span> &{' '}
            <button
              className="p-2 -mx-1 rounded-full transition-colors hover:bg-opacity-20"
              onClick={toggleTheme}
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <span className="text-purple-500 dark:text-purple-400">
              Captivate
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Explore a world of handpicked anime series and movies tailored to
            your unique taste.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-6xl">
          <TabsSection />
        </div>
      </motion.div>

      {/* Featured Section */}
    </div>
  );
}
