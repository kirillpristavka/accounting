// src/pages/ReferencesPage.tsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSettings, FiX } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const ReferencesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { setAllowOverflow, setIsActive } = useAppContext();

  const clearSearch = () => setSearch('');
  const closePage = () => {
    navigate('/');
    setIsActive('');
  };

  useEffect(() => {
    setAllowOverflow(true);
    return () => {
      setAllowOverflow(false);
    };
  }, []);

  return (
    <div className="flex-1 relative z-20 -mt-9 bg-white min-h-screen overflow-visible">
      {/* Поиск, шестерёнка, крестик */}
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
        <FiSettings className="w-5 h-5 cursor-pointer" title="Настройки" />
        <FiX
          className="w-5 h-5 cursor-pointer"
          title="Закрыть"
          onClick={closePage}
        />
      </div>

      {/* Контент */}
      <div className="p-6 pt-16 flex gap-x-10">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div>
          <h2 className="text-[#259e00] text-base mb-2">Банк и касса</h2>
          <NavLink
            to="/references/taxes"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Налоги и взносы
          </NavLink>
          <NavLink
            to="/references/cashflow-articles"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Статьи движения денежных средств
          </NavLink>
          <NavLink
            to="/references/cash-documents"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Номенклатура денежных документов
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">
            Покупки и продажи
          </h2>
          <NavLink
            to="/references/contractors"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Контрагенты
          </NavLink>
          <NavLink
            to="/references/contracts"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Договоры
          </NavLink>
          <NavLink
            to="/references/contract-templates"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Шаблоны договоров
          </NavLink>
          <NavLink
            to="/references/tickets"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Билеты
          </NavLink>
          <NavLink
            to="/references/currencies"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Валюты
          </NavLink>
          <NavLink
            to="/references/leads"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Лиды
          </NavLink>
          <NavLink
            to="/references/lead-statuses"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Состояния работы с лидами
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">
            Товары и услуги
          </h2>
          <NavLink
            to="/nomenclature"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Номенклатура
          </NavLink>
          <NavLink
            to="/references/warehouses"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Склады
          </NavLink>
        </div>

        {/* СРЕДНЯЯ КОЛОНКА */}
        <div>
          <h2 className="text-[#259e00] text-base mb-2">ОС и НМА</h2>
          <NavLink
            to="/references/fixed-assets"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Основные средства
          </NavLink>
          <NavLink
            to="/references/vehicles"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Транспортные средства
          </NavLink>
          <NavLink
            to="/references/asset-repairs"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Виды ремонтов ОС
          </NavLink>
          <NavLink
            to="/references/intangible-assets"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Нематериальные активы
          </NavLink>
          <NavLink
            to="/references/okof-classifier"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Классификатор ОКОФ
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">
            Зарплата и кадры
          </h2>
          <NavLink
            to="/references/employees"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Сотрудники
          </NavLink>
          <NavLink
            to="/references/individuals"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Физические лица
          </NavLink>
          <NavLink
            to="/references/work-schedules"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Графики работы
          </NavLink>

          <h2 className="text-[#259e00] text-base mt-4 mb-2">
            Доходы и расходы
          </h2>
          <NavLink
            to="/references/income-groups"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Номенклатурные группы
          </NavLink>
          <NavLink
            to="/references/expense-items"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Статьи затрат
          </NavLink>
          <NavLink
            to="/references/other-income-expenses"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Прочие доходы и расходы
          </NavLink>
          <NavLink
            to="/references/deferred-income"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Доходы будущих периодов
          </NavLink>
          <NavLink
            to="/references/deferred-expenses"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Расходы будущих периодов
          </NavLink>
          <NavLink
            to="/references/expense-methods"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Способы отражения расходов
          </NavLink>

          <div className="mt-4 mb-2 text-base">См. также</div>
          <NavLink
            to="/references/payment-types"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Виды оплат
          </NavLink>
          <NavLink
            to="/references/production-calendars"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Производственные календари
          </NavLink>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div>
          <h2 className="text-[#259e00] text-base mb-2">Информация</h2>
          <NavLink
            to="/references/news"
            className="block text-sm pl-4 mb-1 hover:underline"
          >
            Новости
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ReferencesPage;