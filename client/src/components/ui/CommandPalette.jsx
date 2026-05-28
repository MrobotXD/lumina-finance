import React, { useState, useEffect, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  ArrowRight,
  Plus,
  Wallet,
  HandCoins,
  Target,
  LayoutDashboard,
  Sun,
  Moon,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../context/UIStore';
import { cn } from '../../utils/cn';
import { ThemeContext } from '../../context/ThemeContext';

const CommandPalette = () => {
  const { isCommandPaletteOpen, setCommandPalette, globalSearchQuery, setSearchQuery } = useUIStore();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'dash', name: 'Ir al Dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard'), type: 'navigation' },
    { id: 'exp', name: 'Ver Gastos', icon: Wallet, action: () => navigate('/expenses'), type: 'navigation' },
    { id: 'debt', name: 'Ver Deudas', icon: HandCoins, action: () => navigate('/debts'), type: 'navigation' },
    { id: 'bud', name: 'Ver Presupuestos', icon: Target, action: () => navigate('/budgets'), type: 'navigation' },
    { id: 'theme', name: 'Cambiar Tema', icon: darkMode ? Sun : Moon, action: () => toggleTheme(), type: 'action' },
// ... inside actions array
    { id: 'reports', name: 'Centro de Reportes', icon: Download, action: () => navigate('/reports'), type: 'navigation' },
// ...
    { id: 'add_exp', name: 'Nuevo Gasto', icon: Plus, action: () => { navigate('/expenses'); setCommandPalette(false); }, type: 'action' },
  ];

  const filteredActions = useMemo(() => {
    return actions.filter(a => a.name.toLowerCase().includes(globalSearchQuery.toLowerCase()));
  }, [globalSearchQuery]);

  const executeAction = (action) => {
    action.action();
    setCommandPalette(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!isCommandPaletteOpen);
      }

      if (!isCommandPaletteOpen) return;

      if (e.key === 'Escape') setCommandPalette(false);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
      }
      if (e.key === 'Enter') {
        if (filteredActions[selectedIndex]) {
          executeAction(filteredActions[selectedIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPalette, filteredActions, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [globalSearchQuery]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search size={20} className="text-slate-400" />
              <input
                autoFocus
                placeholder="Busca acciones, páginas o datos... (Cmd+K)"
                className="flex-1 bg-transparent outline-none text-lg text-slate-800 dark:text-slate-100"
                value={globalSearchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                <Command size={10} /> K
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones Rápidas</div>
              <div className="space-y-1">
                {filteredActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      onClick={() => executeAction(action)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group",
                        selectedIndex === i ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={cn("transition-colors", selectedIndex === i ? "text-white" : "text-slate-400 group-hover:text-primary-500")} />
                        <span className="font-medium">{action.name}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-slate-400">ENTER</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredActions.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p>No se encontraron resultados para "{globalSearchQuery}"</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <div className="flex gap-4">
                <span><span className="text-slate-300 dark:text-slate-600">↑↓</span> Navegar</span>
                <span><span className="text-slate-300 dark:text-slate-600">Enter</span> Ejecutar</span>
              </div>
              <div>Esc para cerrar</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
