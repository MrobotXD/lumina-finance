import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ children, className = '', title = null, subtitle = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "relative overflow-hidden transition-all duration-300",
      "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md",
      "border border-slate-200/50 dark:border-slate-700/50",
      "rounded-2xl p-6 shadow-glass hover:shadow-premium dark:hover:shadow-dark-premium",
      className
    )}
  >
    {title && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
    )}
    {children}
  </motion.div>
);

export default Card;
