// src/pages/MainPage.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSettings, FiX } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const MainPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isActive, setIsActive } = useAppContext();

  const clearSearch = () => setSearch('');
  const closePage = () => {
    navigate('/');
    setIsActive('');
  };

  return (
    <div className="flex-1 relative bg-white h-full overflow-auto">
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск (Ctrl+F)"
            className="border border-gray-300 rounded text-base py-1 pl-3 pr-8 focus:outline-none"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base"
              title="Очистить поиск"
            >
              <FiX />
            </button>
          )}
        </div>
        <FiSettings
          className="w-5 h-5 cursor-pointer"
          title="Настройки"
        />
        <FiX
          className="w-5 h-5 cursor-pointer"
          title="Закрыть"
          onClick={closePage}
        />
      </div>

      {/* Само меню с пунктами
          Отступ сверху mt-16 (4rem) — чтобы меню не попало под абсолютный поиск */}
      <div className="p-6 pt-16 flex gap-x-10">
        {/* Левая колонка */}
        <div>
          <h2 className="text-[#259e00] text-base mb-2">Взаимодействие</h2>
          <NavLink to="/mail" className="block text-sm pl-4 mb-1 hover:underline">
            Почта
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Единый налоговый счет</h2>
          <NavLink
            to="/ens/calculations"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Расчеты по ЕНС
          </NavLink>
          <NavLink
            to="/ens/taxes"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Расчеты по налогам на ЕНС
          </NavLink>
          <NavLink
            to="/ens/cabinet"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Личный кабинет ЕНС
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Мобильные приложения</h2>
          <NavLink
            to="/apps/scanner"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            1С:Сканер чеков
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Операции</h2>
          <NavLink
            to="/operations/create"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Ввести хозяйственную операцию
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Сервисы</h2>
          <NavLink
            to="/services/1cplus"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            1С:Плюс
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Задачи</h2>
          <NavLink
            to="/tasks/org"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Задачи организации
          </NavLink>
          <NavLink
            to="/tasks/my"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Мои задачи
          </NavLink>
        </div>

        {/* Правая колонка */}
        <div>
          <h2 className="text-[#259e00] text-base mb-2">Настройки</h2>
          <NavLink
            to="/settings/functionality"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Функциональность
          </NavLink>
          <NavLink
            onClick={() => setIsActive('')}
            to="/organizations"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Организации
          </NavLink>
          <NavLink
            to="/settings/egrul"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Внесение изменений в ЕГРЮЛ, ЕГРИП
          </NavLink>
          <NavLink
            to="/settings/taxes"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Налоги и отчеты
          </NavLink>
          <NavLink
            to="/settings/accounting"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Учетная политика
          </NavLink>
          <NavLink
            to="/settings/chartofaccounts"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            План счетов
          </NavLink>
          <NavLink
            to="/settings/personal"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Персональные настройки
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Начало работы</h2>
          <NavLink
            onClick={() => setIsActive('')}
            to="/balance-entry-assistant"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Помощник ввода остатков
          </NavLink>
          <NavLink
            to="/onboarding/load7"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Загрузка из 1С:Предприятия 7.7
          </NavLink>
          <NavLink
            to="/onboarding/loadreports"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Загрузка из 1С:Отчетность предпринимателя
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">Информация</h2>
          <NavLink
            to="/info/allnews"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Все новости
          </NavLink>
          <NavLink
            to="/info/updates"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Обновления
          </NavLink>
          <NavLink
            to="/info/about"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Знакомство с программой
          </NavLink>
          <NavLink
            to="/info/additional"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Дополнительная информация
          </NavLink>
          <NavLink
            to="/info/news"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Новости
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MainPage;