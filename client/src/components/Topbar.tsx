// src/components/Topbar.tsx
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

// Импортируем resetForm из стора “Создания” (одноимённый reset сбрасывает стор создания)
import { useOrganizationCreate } from '../stores/useOrganizationCreate';

// Импортируем resetForm из стора “Редактирования”.
// Поскольку этот resetForm нужен только как тип, а не как значение в рантайме, импортируем через type-only.
// Однако функцию мы вызываем в runtime, поэтому её нужно импортировать “обычным” импортом:
import { useOrganizationEdit } from '../stores/useOrganizationEdit';
import type { Taxation } from '../stores/useOrganizationEdit'; // Если где-то нужен тип

// Статические имена маршрутов (без “динамических” /organizations/:id/edit)
const routeNames: Record<string, string> = {
  '/': 'Начальная страница',
  '/organizations': 'Организации',
  '/organizations/create': 'Организация (создание)',
  '/nomenclature': 'Номенклатура',
  '/nomenclature/create': 'Номенклатура (создание)',
  // … другие статические пути …
};

const Topbar: React.FC = () => {
  const { openTabs, openTab, closeTab } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const didFetchOrgRef = useRef(false);

  // Функция сброса стора создания
  const resetCreateForm = useOrganizationCreate((state) => state.resetForm);
  // Функция сброса стора редактирования
  const resetEditForm = useOrganizationEdit((state) => state.resetForm);

  useEffect(() => {
    const path = location.pathname;

    // 1) Если это страница редактирования организации: "/organizations/:id/edit"
    const orgEditMatch = path.match(/^\/organizations\/(\d+)\/edit$/);
    if (orgEditMatch) {
      // Если уже подгружали для этой вкладки, не делаем повторно
      if (didFetchOrgRef.current) return;
      didFetchOrgRef.current = true;

      const orgId = orgEditMatch[1];
      axios
        .get<{ lastName: string; firstName: string; middleName: string }>(
          `/api/organizations/${orgId}`
        )
        .then((resp) => {
          const { lastName, firstName, middleName } = resp.data;
          // Формируем ФИО в формате "Фамилия И.О."
          const fio = lastName
            ? `${lastName.trim()} ${
                firstName ? firstName.trim()[0].toUpperCase() + '.' : ''
              }${middleName ? middleName.trim()[0].toUpperCase() + '.' : ''}`
            : '<Без названия>';
          const label = `${fio} (Организация)`;

          if (!openTabs.some((tab) => tab.path === path)) {
            openTab(label, path);
          }
        })
        .catch(() => {
          // Если не удалось подгрузить ФИО, показываем fallback
          const fallbackLabel = `Организация #${orgId}`;
          if (!openTabs.some((tab) => tab.path === path)) {
            openTab(fallbackLabel, path);
          }
        });

      return;
    }

    // 2) Иначе – статическая вкладка из routeNames
    const labelStatic = routeNames[path];
    if (labelStatic && !openTabs.some((tab) => tab.path === path)) {
      openTab(labelStatic, path);
    }
  }, [location.pathname]); // Зависит только от location.pathname

  // Когда маршрут меняется (включая уход со страницы), сбрасываем флаг didFetchOrgRef,
  // чтобы при возвращении на "…/:id/edit" заново подгрузить ФИО
  useEffect(() => {
    return () => {
      didFetchOrgRef.current = false;
    };
  }, [location.pathname]);

  const handleSelect = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleClose = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();

    // Если закрывается вкладка “Создать организацию”
    if (path === '/organizations/create') {
      resetCreateForm();
    }

    // Если закрывается вкладка “Редактировать организацию” вида "/organizations/:id/edit"
    const editMatch = path.match(/^\/organizations\/(\d+)\/edit$/);
    if (editMatch) {
      // Вытаскиваем id и сбрасываем только конкретный "ячейку" стора редактирования
      const id = editMatch[1];
      resetEditForm(id);
    }

    // Закрываем вкладку в AppContext
    closeTab(path);

    // Если закрытая вкладка была активной, переключаемся на предыдущую
    if (location.pathname === path) {
      const remaining = openTabs.filter((tab) => tab.path !== path);
      const prev = remaining[remaining.length - 1] || { path: '/' };
      navigate(prev.path, { replace: true });
    }
  };

  return (
    <header className="relative z-10 w-full bg-gray-100 border-b border-gray-200">
      <nav className="flex">
        {openTabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <div
              key={tab.path}
              onClick={() => handleSelect(tab.path)}
              className={`
                relative flex items-center px-4 py-2 mr-2 cursor-pointer select-none
                border-b-2
                ${
                  active
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-200'
                }
              `}
            >
              <span className="pr-4">{tab.label}</span>
              {tab.path !== '/' && (
                <button
                  onClick={(e) => handleClose(e, tab.path)}
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