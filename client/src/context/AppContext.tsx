import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Tab {
  label: string;
  path: string;
}

interface AppContextType {
  isActive: string;
  setIsActive: (label: string) => void;
  openTabs: Tab[];
  openTab: (label: string, path: string) => void;
  closeTab: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState<string>('');
  const [openTabs, setOpenTabs] = useState<Tab[]>([
    {label: "Начальная страница", path: "/"}
  ]);

  const openTab = (label: string, path: string) => {
    setOpenTabs(prev => {
      if (prev.some(tab => tab.path === path)) return prev;
      return [...prev, { label, path }];
    });
  };

  const closeTab = (path: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.path !== path));
  };

  return (
    <AppContext.Provider value={{ isActive, setIsActive, openTabs, openTab, closeTab }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};