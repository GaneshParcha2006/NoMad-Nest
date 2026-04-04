import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import { Compass, Moon, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gray-900 dark:bg-white p-2.5 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <Compass className="w-6 h-6 text-white dark:text-black" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
              NomadNest
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all border border-gray-100 dark:border-white/10 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
