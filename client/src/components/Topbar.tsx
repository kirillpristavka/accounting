// src/components/Topbar.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const routeNames: Record<string, string> = {
  '/': 'Начальная страница',
  '/organizations': 'Организации',
  '/organizations/create': 'Организация (создание)',
  '/nomenclature': 'Номенклатура',
  '/nomenclature/create': 'Номенклатура (создание)',
  // …добавьте при необходимости остальные пути…
};



const Topbar: React.FC = () => {
  const { openTabs, openTab, closeTab } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { isActive, setIsActive } = useAppContext();

  // Авто‑открытие вкладки при смене URL
  useEffect(() => {
    const path = location.pathname;
    const label = routeNames[path];
    if (label && !openTabs.some(tab => tab.path === path)) {
      openTab(label, path);
    }
  }, [location.pathname]);

  const handleSelect = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
      setIsActive("");
    }
  };

  const handleClose = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    closeTab(path);
    if (location.pathname === path) {
      const remaining = openTabs.filter(tab => tab.path !== path);
      const prev = remaining[remaining.length - 1] || { path: '/' };
      navigate(prev.path, { replace: true });
    }
  };

  return (
    <header className="relative z-10 w-full bg-gray-100 border-b border-gray-200">
      <nav className="flex">
        {openTabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <div
              key={tab.path}
              onClick={() => handleSelect(tab.path)}
              className={`
                relative flex items-center px-4 py-2 mr-2 cursor-pointer select-none
                border-b-2
                ${active
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-200'}
              `}
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