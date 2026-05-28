import React from 'react';
import Card from '../ui/Card';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CommandPalette from '../ui/CommandPalette';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <CommandPalette />
      </div>
    </div>
  );
};

export default Layout;
