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
import { Home, X } from 'lucide-react';

// Статические имена маршрутов (без “динамических” /organizations/:id/edit)
const routeNames: Record<string, string> = {
  '/': 'Начальная страница',
  '/organizations': 'Организации',
  '/organizations/create': 'Организация (создание)',
  '/nomenclature': 'Номенклатура',
  '/nomenclature/create': 'Номенклатура (создание)',
  '/balance-entry-assistant': 'Помощник ввода начальных остатков',
  '/goods-balance-entry': 'Ввод остатков (Товары)'
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

    // 1) Редактирование организации
    const orgEditMatch = path.match(/^\/organizations\/(\d+)\/edit$/);
    if (orgEditMatch) {
      if (didFetchOrgRef.current) return;
      didFetchOrgRef.current = true;

      const orgId = orgEditMatch[1];
      axios
        .get(`/api/organizations/${orgId}`)
        .then((resp) => {
          const { lastName, firstName, middleName } = resp.data;
          const fio = lastName
            ? `${lastName.trim()} ${firstName?.trim()[0]?.toUpperCase() || ''}.${middleName?.trim()[0]?.toUpperCase() || ''}.`
            : '<Без названия>';
          const label = `${fio} (Организация)`;

          if (!openTabs.some((tab) => tab.path === path)) {
            openTab(label, path);
          }
        })
        .catch(() => {
          const fallbackLabel = `Организация #${orgId}`;
          if (!openTabs.some((tab) => tab.path === path)) {
            openTab(fallbackLabel, path);
          }
        });

      return;
    }

    // 1.5) Документы по конкретному счету
    if (path.startsWith('/balance-entry/')) {
      const label = 'Ввод остатков';
      if (!openTabs.some((tab) => tab.path === path)) {
        openTab(label, path);
      }
      return;
    }

    // 2) Статические маршруты
    const labelStatic = routeNames[path];
    if (labelStatic && !openTabs.some((tab) => tab.path === path)) {
      openTab(labelStatic, path);
    }
  }, [location.pathname]);

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
    <header className="relative z-10 w-full bg-gray-100 border-b-1 border-gray-300">
      <nav className="flex">
        {openTabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <div
              key={tab.path}
              onClick={() => handleSelect(tab.path)}
              className={`
                relative flex items-center pl-2 pr-4 select-none pb-2 pt-1
                border-r-1 border-gray-400
                ${
                  active
                    ? 'text-gray-900 bg-white'
                    : 'text-gray-600'
                }
              `}
            >
              {tab.path === '/' && <Home size={18} className="ml-0.5 mr-2.5 pt-0.5" />}
              <span className="text-sm mr-2">{tab.label}</span>

              {active && (
                <div className="absolute inset-x-0 left-1 right-1 bottom-0.5 h-0.5 bg-green-500" />
              )}

              {tab.path !== '/' && (
                <button
                  onClick={(e) => handleClose(e, tab.path)}
                  className="hover:bg-gray-300 rounded-full p-0.25 absolute right-1.25 top-2"
                  title={`Закрыть вкладку ${tab.label}`}
                >
                  <X size={14} className="" />
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