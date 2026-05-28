import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className = '', variant = 'circle' }) => {
  const baseStyles = "animate-shimmer bg-slate-200 dark:bg-slate-800 relative overflow-hidden";
  const shapes = {
    circle: "w-10 h-10 rounded-full",
    rect: "w-full h-full rounded-xl",
    text: "w-3/4 h-4 rounded-md",
    avatar: "w-12 h-12 rounded-full"
  };

  return (
    <div className={cn(baseStyles, shapes[variant], className)} />
  );
};

export default Skeleton;
