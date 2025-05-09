import React, { type JSX } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Briefcase,
  DollarSign,
  ShoppingCart,
  Package,
  Settings,
  Users,
  FileText,
  HelpCircle,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Главное", icon: Home, path: "/main" },
  { label: "Руководителю", icon: Briefcase, path: "/" },
  { label: "Банк и касса", icon: DollarSign, path: "/" },
  { label: "Продажи", icon: ShoppingCart, path: "/sales" },
  { label: "Покупки", icon: Package, path: "/" },
  { label: "Производство", icon: Settings, path: "/" },
  { label: "ОС и НМА", icon: FileText, path: "/" },
  { label: "Зарплата и кадры", icon: Users, path: "/" },
  { label: "Операции", icon: FileText, path: "/" },
  { label: "Отчеты", icon: FileText, path: "/reports" },
  { label: "Справочники", icon: FileText, path: "/" },
  { label: "Администрирование", icon: Settings, path: "/settings" },
  { label: "Помощь", icon: HelpCircle, path: "/" },
];

interface SidebarProps {
  active: string;
  setActive: (label: string) => void;
}

export default function SidebarComponent({ active, setActive }: SidebarProps): JSX.Element {
  return (
    <div
      id="sidebar"
      className="bg-yellow-200 h-screen p-4 w-64 fixed top-0 left-0 z-40"
    >
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;

          return (
            <Link
              key={item.label}
              to={isActive ? "/" : item.path}
              onClick={() => setActive(isActive ? "" : item.label)}
              className={
                `flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ` +
                (isActive ? "bg-yellow-300" : "hover:bg-yellow-300")
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-black">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
