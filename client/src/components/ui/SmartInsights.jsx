import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Info,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  PieChart as PieIcon,
  Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';

const InsightCard = ({ insight }) => {
  const config = {
    warning: { color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', icon: AlertTriangle },
    info: { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: Info },
    success: { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: TrendingUp },
    danger: { color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: AlertCircle },
    neutral: { color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700', icon: PieIcon },
  };

  const { color, bg, border, icon: Icon } = config[insight.type] || config.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-2xl border transition-all duration-300 group cursor-default",
        bg, "border"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-lg shrink-0", color)}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-medium leading-relaxed", color)}>
            {insight.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const SmartInsights = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary-500 text-white">
          <Zap size={14} fill="currentColor" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">AI Financial Insights</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default SmartInsights;
