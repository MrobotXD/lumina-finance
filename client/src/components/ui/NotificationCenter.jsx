import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../context/UIStore';
import { cn } from '../../utils/cn';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useUIStore();

  return (
    <AnimatePresence>
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-premium dark:shadow-dark-premium flex gap-4 items-start"
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              n.type === 'success' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" :
              n.type === 'warning' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
              n.type === 'danger' ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
              "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
            )}>
              {n.type === 'success' ? <CheckCircle2 size={18} /> :
               n.type === 'warning' ? <AlertTriangle size={18} /> :
               n.type === 'danger' ? <AlertCircle size={18} /> : <Info size={18} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default NotificationCenter;
