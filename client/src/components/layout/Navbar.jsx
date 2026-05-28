import React, { useState } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon, Search, Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useUIStore } from '../../context/UIStore';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { globalSearchQuery, setSearchQuery } = useUIStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-xs font-medium text-slate-400 uppercase tracking-widest">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="flex items-center gap-3 max-w-xl w-full mx-4">
        <div className={cn(
          "relative flex items-center w-full transition-all duration-300 rounded-2xl border",
          isSearchFocused
            ? "ring-2 ring-primary-400/50 border-primary-400 bg-white dark:bg-slate-800"
            : "bg-slate-100/50 dark:bg-slate-800/50 border-transparent"
        )}>
          <Search className="absolute left-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Búsqueda global... (Cmd+K)"
            className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200"
            value={globalSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 hidden sm:flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-sans text-slate-500">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors">Usuario Premium</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-blue-300 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            <span className="font-bold text-xs">UP</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
