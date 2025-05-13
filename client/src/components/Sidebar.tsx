import React from 'react';
import { Link } from 'react-router-dom';
import { Home, UserCheck, CreditCard, ShoppingCart, ShoppingBag, Package, Factory, Layers, Users, Activity, BarChart2, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  link: string;
}

const menuItems: MenuItem[] = [
  { label: 'Главное', icon: <Home size={20} />, link: '/main' },
  { label: 'Руководителю', icon: <UserCheck size={20} />, link: '/manager' },
  { label: 'Банк и касса', icon: <CreditCard size={20} />, link: '/bank-cash' },
  { label: 'Продажи', icon: <ShoppingCart size={20} />, link: '/sales' },
  { label: 'Покупки', icon: <ShoppingBag size={20} />, link: '/purchases' },
  { label: 'Склад', icon: <Package size={20} />, link: '/warehouse' },
  { label: 'Производство', icon: <Factory size={20} />, link: '/production' },
  { label: 'ОС и НМА', icon: <Layers size={20} />, link: '/assets' },
  { label: 'Зарплата и кадры', icon: <Users size={20} />, link: '/hr' },
  { label: 'Операции', icon: <Activity size={20} />, link: '/operations' },
  { label: 'Отчеты', icon: <BarChart2 size={20} />, link: '/reports' },
  { label: 'Справочники', icon: <BookOpen size={20} />, link: '/references' },
  { label: 'Администрирование', icon: <Settings size={20} />, link: '/admin' },
  { label: 'Помощь', icon: <HelpCircle size={20} />, link: '/help' },
];

const Sidebar: React.FC = () => {
  const { isActive, setIsActive } = useAppContext();

  return (
    <div className="w-60 bg-[#FFF7D2] min-h-screen transition-all duration-200">
      <nav className="mt-4">
        <ul>
          {menuItems.map(item => {
            return (
              <li key={item.label} className="mb-1">
                <Link
                  onClick={() => {
                    isActive == item.label ? setIsActive("") : setIsActive(item.label)
                  }}
                  to={isActive == item.label ? "/" : item.link}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition-colors duration-150 ${isActive == item.label ? 'bg-white' : 'hover:bg-[#FFF9D9]'}`}
                >
                  {item.icon}
                  {<span className="text-gray-800 text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;