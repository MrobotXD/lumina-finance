import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      globalSearchQuery: '',
      isCommandPaletteOpen: false,
      notifications: [],
      activeFilters: {
        category: null,
        dateRange: { start: null, end: null },
        search: '',
      },

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSearchQuery: (query) => set({ globalSearchQuery: query }),
      setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now() }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),
      setFilters: (filters) => set((state) => ({
        activeFilters: { ...state.activeFilters, ...filters }
      })),
      resetFilters: () => set({
        activeFilters: { category: null, dateRange: { start: null, end: null }, search: '' }
      }),
    }),
    { name: 'ui-storage' }
  )
);
