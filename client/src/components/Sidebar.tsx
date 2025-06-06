// src/components/Sidebar.tsx
import React from 'react';
import {
  Home, UserCheck, CreditCard, ShoppingCart, ShoppingBag, Package,
  Factory, Layers, Users, Activity, BarChart2, BookOpen, Settings, HelpCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { label: 'Главное',          icon: <Home size={20} /> },
  { label: 'Руководителю',     icon: <UserCheck size={20} /> },
  { label: 'Банк и касса',     icon: <CreditCard size={20} /> },
  { label: 'Продажи',          icon: <ShoppingCart size={20} /> },
  { label: 'Покупки',          icon: <ShoppingBag size={20} /> },
  { label: 'Склад',            icon: <Package size={20} /> },
  { label: 'Производство',     icon: <Factory size={20} /> },
  { label: 'ОС и НМА',         icon: <Layers size={20} /> },
  { label: 'Зарплата и кадры', icon: <Users size={20} /> },
  { label: 'Операции',         icon: <Activity size={20} /> },
  { label: 'Отчеты',           icon: <BarChart2 size={20} /> },
  { label: 'Справочники',      icon: <BookOpen size={20} /> },
  { label: 'Администрирование',icon: <Settings size={20} /> },
  { label: 'Помощь',           icon: <HelpCircle size={20} /> },
];

const Sidebar: React.FC = () => {
  const { isActive, setIsActive } = useAppContext();

  return (
    <div className="relative w-60 bg-[#FFF7D2] min-h-screen">
      <nav className="mt-4">
        <ul>
          {menuItems.map(item => (
            <li key={item.label} className="mb-1">
              <button
                onClick={() => {
                  // если кликнули на уже открытый пункт — закрываем,
                  // иначе открываем этот пункт
                  if (isActive === item.label) {
                    setIsActive('');
                  } else {
                    setIsActive(item.label);
                  }
                }}
                className={[
                  'w-full flex items-center gap-3 px-4 py-2 text-left rounded transition-colors duration-150',
                  isActive === item.label
                    ? 'bg-white'
                    : 'hover:bg-[#FFF9D9]'
                ].join(' ')}
              >
                {item.icon}
                <span className="text-gray-800 text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;