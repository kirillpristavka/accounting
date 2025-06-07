// src/components/PopupBlock.tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import MainPage from '../pages/MainPage';
import ReferencesPage from '../pages/ReferencesPage';

const PopupBlock: React.FC = () => {
  const { isActive } = useAppContext();

  if (!isActive) {
    return null;
  }

  // Общие CSS-классы для обёртки всплывающего блока
  const baseClasses = `
    absolute
    top-2                /* 14*4px = 56px от верха (под Topbar h-[56px]) */
    left-49.75           /* 60*4px = 240px от левого края (Sidebar w-60) */
    right-2              /* 4*4px = 16px от правого края */
    bottom-2             /* 4*4px = 16px от низа */
    bg-white
    border border-gray-300
    shadow-sm
    overflow-hidden      /* скрываем скролл у контейнера, прокрутка пойдёт внутри */
    rounded-sm
    z-20                 /* поверх Topbar (z-10) */
  `;

  // Если «Главное» — рендерим MainPage
  if (isActive === 'Главное') {
    return (
      <div className={baseClasses}>
        <MainPage />
      </div>
    );
  }

  // Если «Справочники» — рендерим ReferencesPage
  if (isActive === 'Справочники') {
    return (
      <div className={baseClasses}>
        <ReferencesPage />
      </div>
    );
  }

  // Для всех остальных пунктов (например, «Продажи», «Банк и касса» и т.д.)
  return (
    <div className={baseClasses}>
      <div className="h-full overflow-auto p-6">
        <h2 className="text-green-600 font-bold mb-2">{isActive}</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {/* Здесь можно подставить конкретные ссылки/пункты для остальных разделов */}
          <li>Пункт 1 для «{isActive}»</li>
          <li>Пункт 2 для «{isActive}»</li>
          <li>... и т. д. ...</li>
        </ul>
      </div>
    </div>
  );
};

export default PopupBlock;