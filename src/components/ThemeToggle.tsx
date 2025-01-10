import { Moon, Sun } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { themeAtom } from '../store/atoms';
import { cn } from '../lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useRecoilState(themeAtom);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        'w-10 h-10 relative rounded-xl',
        'bg-white/10 dark:bg-gray-800',
        'hover:bg-white/20 dark:hover:bg-gray-700',
        'border border-white/20 dark:border-gray-700',
        'transition-all duration-300 ease-in-out',
        'shadow-lg'
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : 180,
          scale: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Moon className="w-5 h-5 text-yellow-300" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : -180,
          scale: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Sun className="w-5 h-5 text-yellow-400" />
      </motion.div>
    </motion.button>
  );
}