// src/components/Topbar.tsx
import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const routeNames: Record<string, string> = {
  '/': 'Начальная страница',
  '/main': 'Главная',
  '/organizations': 'Организации',
  // …другие маршруты…
};

const Topbar: React.FC = () => {
  const { openTabs, openTab, closeTab } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const justClosedRef = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    const label = routeNames[path];
    const alreadyOpen = openTabs.some(tab => tab.path === path);

    if (label && !alreadyOpen && justClosedRef.current !== path) {
      openTab(label, path);
    }
    if (justClosedRef.current === path) {
      justClosedRef.current = null;
    }
  }, [location.pathname, openTabs, openTab]);

  const handleSelect = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleClose = (
    e: React.MouseEvent<HTMLButtonElement>,
    path: string
  ) => {
    e.stopPropagation();
    justClosedRef.current = path;
    closeTab(path);

    if (location.pathname === path) {
      const remaining = openTabs.filter(tab => tab.path !== path);
      const prev = remaining[remaining.length - 1] || { path: '/' };
      navigate(prev.path, { replace: true });
    }
  };

  return (
    <header className="w-full bg-gray-100 border-b border-gray-200">
      <nav className="flex">
        {openTabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <div
              key={tab.path}
              className={`relative flex items-center px-4 py-2 mr-2 cursor-pointer select-none
                ${active
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}
              `}
              onClick={() => handleSelect(tab.path)}
            >
              <span className="pr-4">{tab.label}</span>
              {tab.path !== '/' && (
                <button
                  onClick={e => handleClose(e, tab.path)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-1 text-sm hover:text-red-600"
                  aria-label={`Закрыть вкладку ${tab.label}`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
};

export default Topbar;
