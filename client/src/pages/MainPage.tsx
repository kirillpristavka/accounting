import type { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Settings, X } from 'lucide-react';

interface MainPageProps {
  onClose: () => void;
}

export default function MainPage({ onClose }: MainPageProps): JSX.Element {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="p-6 flex-1">
      {/* Top right search and icons */}
      <div className="flex justify-end items-center mb-6 space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск (Ctrl+F)"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <Settings className="cursor-pointer" />
        <button onClick={handleClose} aria-label="Close" className="cursor-pointer">
          <X />
        </button>
      </div>

      {/* Main menu grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          <h2 className="text-lg font-semibold text-green-600 mb-2">Взаимодействие</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/mail" className="block cursor-pointer hover:underline">
                Почта
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Единый налоговый счет</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/ens/calculations" className="block cursor-pointer hover:underline">
                Расчеты по ЕНС
              </Link>
            </li>
            <li>
              <Link to="/ens/taxes" className="block cursor-pointer hover:underline">
                Расчеты по налогам на ЕНС
              </Link>
            </li>
            <li>
              <Link to="/ens/cabinet" className="block cursor-pointer hover:underline">
                Личный кабинет ЕНС
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Мобильные приложения</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/mobile/scanner" className="block cursor-pointer hover:underline">
                1С:Сканер чеков
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Операции</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/operations/new" className="block cursor-pointer hover:underline">
                Ввести хозяйственную операцию
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Сервисы</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/services/plus" className="block cursor-pointer hover:underline">
                1С:Плюс
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Задачи</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/tasks/organization" className="block cursor-pointer hover:underline">
                Задачи организации
              </Link>
            </li>
            <li>
              <Link to="/tasks/my" className="block cursor-pointer hover:underline">
                Мои задачи
              </Link>
            </li>
          </ul>
        </div>

        {/* Right column */}
        <div>
          <h2 className="text-lg font-semibold text-green-600 mb-2">Настройки</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/settings/functionality" className="block cursor-pointer hover:underline">
                Функциональность
              </Link>
            </li>
            <li>
              <Link to="/organizations" className="block cursor-pointer hover:underline">
                Организации
              </Link>
            </li>
            <li>
              <Link to="/settings/egr" className="block cursor-pointer hover:underline">
                Внесение изменений в ЕГРЮЛ, ЕГРИП
              </Link>
            </li>
            <li>
              <Link to="/settings/taxes-reports" className="block cursor-pointer hover:underline">
                Налоги и отчеты
              </Link>
            </li>
            <li>
              <Link to="/settings/accounting" className="block cursor-pointer hover:underline">
                Учетная политика
              </Link>
            </li>
            <li>
              <Link to="/settings/chart-of-accounts" className="block cursor-pointer hover:underline">
                План счетов
              </Link>
            </li>
            <li>
              <Link to="/settings/personal" className="block cursor-pointer hover:underline">
                Персональные настройки
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Начало работы</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <Link to="/start/balances" className="block cursor-pointer hover:underline">
                Помощник ввода остатков
              </Link>
            </li>
            <li>
              <Link to="/start/import-7-7" className="block cursor-pointer hover:underline">
                Загрузка из 1С:Предприятия 7.7
              </Link>
            </li>
            <li>
              <Link to="/start/import-reporting" className="block cursor-pointer hover:underline">
                Загрузка из 1С:Отчетность предпринимателя
              </Link>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-green-600 mb-2">Информация</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/info/news-all" className="block cursor-pointer hover:underline">
                Все новости
              </Link>
            </li>
            <li>
              <Link to="/info/updates" className="block cursor-pointer hover:underline">
                Обновления
              </Link>
            </li>
            <li>
              <Link to="/info/intro" className="block cursor-pointer hover:underline">
                Знакомство с программой
              </Link>
            </li>
            <li>
              <Link to="/info/more" className="block cursor-pointer hover:underline">
                Дополнительная информация
              </Link>
            </li>
            <li>
              <Link to="/info/news" className="block cursor-pointer hover:underline">
                Новости
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}