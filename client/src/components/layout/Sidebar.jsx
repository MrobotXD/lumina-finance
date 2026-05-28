import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  HandCoins,
  PieChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../context/UIStore';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
    { path: '/expenses', name: 'Gastos', icon: Wallet, group: 'Main' },
    { path: '/debts', name: 'Deudas', icon: HandCoins, group: 'Main' },
    { path: '/budgets', name: 'Presupuestos', icon: PieChart, group: 'Main' },
    { path: '/settings', name: 'Configuración', icon: Settings, group: 'System' },
  ];

  const groups = ['Main', 'System'];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      className="h-screen sticky top-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 flex flex-col z-20"
    >
      <div className="p-6 flex items-center justify-between overflow-hidden">
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent whitespace-nowrap"
          >
            FinanzasPro
          </motion.span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-6">
        {groups.map(group => (
          <div key={group} className="space-y-1">
            {!sidebarCollapsed && (
              <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
                {group === 'Main' ? 'Menú Principal' : 'Sistema'}
              </span>
            )}
            {menuItems.filter(item => item.group === group).map(({ path, name, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center p-3 rounded-xl transition-all relative group",
                    isActive
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon size={22} className="shrink-0" />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-3 font-medium"
                    >
                      {name}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 rounded-xl ring-2 ring-primary-300 dark:ring-primary-600 animate-pulse"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className={cn(
          "flex items-center p-3 rounded-2xl transition-all",
          sidebarCollapsed ? "justify-center" : "gap-3 bg-slate-100 dark:bg-slate-800/50"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-blue-300 shrink-0" />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">{user?.username}</p>
              <p className="text-xs text-slate-500 truncate">Premium Plan</p>
            </div>
          )}
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className={cn("w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20", sidebarCollapsed && "justify-center px-0")}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="ml-3 font-medium">Salir</span>}
        </Button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
