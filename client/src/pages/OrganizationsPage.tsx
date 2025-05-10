// src/pages/OrganizationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronDown,
  FileText,
  Printer,
  Mail,
  List,
  Paperclip,
  Trash2,
} from 'lucide-react';
import type { JSX } from 'react';

interface Organization {
  id: number;
  fullName: string;
  inn: string;
  ogrnip: string | null;
  status: string;
}

export default function OrganizationsPage(): JSX.Element {
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await fetch('/api/organizations');
        if (!res.ok) throw new Error(res.statusText);
        const data: Organization[] = await res.json();
        setOrgs(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Не удалось загрузить организации');
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  const handleDelete = async () => {
    if (selectedOrgId === null) return;
    const confirmed = window.confirm('Вы уверены, что хотите удалить выбранную организацию?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/organizations/${selectedOrgId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(res.statusText);
      setOrgs(prev => prev.filter(org => org.id !== selectedOrgId));
      setSelectedOrgId(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ошибка при удалении организации');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex-1 flex items-center justify-center">
        Загрузка организаций…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex-1">
        <div className="text-red-600">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1">
      {/* Header with navigation, title and actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Forward"
            className="p-2 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <Star className="w-5 h-5 text-gray-600" />
          <h1 className="text-xl font-semibold">Организации</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={!selectedOrgId}
            onClick={handleDelete}
            title="Удалить"
            className={`p-2 hover:bg-gray-100 rounded ${
              selectedOrgId ? 'text-red-600 hover:text-red-800' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Поиск (Ctrl+F)"
            className="pl-3 pr-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => navigate('/organizations/create')}
            className="px-3 py-1 border border-gray-300 rounded flex items-center space-x-1 hover:bg-gray-100"
          >
            <span>Создать</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button title="Реквизиты" className="p-2 hover:bg-gray-100 rounded">
            <FileText className="w-5 h-5" />
          </button>
          <button title="Печать" className="p-2 hover:bg-gray-100 rounded">
            <Printer className="w-5 h-5" />
          </button>
          <button title="Email" className="p-2 hover:bg-gray-100 rounded">
            <Mail className="w-5 h-5" />
          </button>
          <button title="Список" className="p-2 hover:bg-gray-100 rounded">
            <List className="w-5 h-5" />
          </button>
          <button title="Прикрепить" className="p-2 hover:bg-gray-100 rounded">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table of organizations with selection */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left" />
              <th className="px-4 py-2 text-left">Наименование в программе</th>
              <th className="px-4 py-2 text-left">ИНН</th>
              <th className="px-4 py-2 text-left">КПП</th>
              <th className="px-4 py-2 text-left">Статус регистрации</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map(org => {
              const isSelected = org.id === selectedOrgId;
              return (
                <tr
                  key={org.id}
                  onClick={() => setSelectedOrgId(org.id)}
                  onDoubleClick={() => navigate(`/organizations/${org.id}`)}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    isSelected ? 'bg-blue-100' : ''
                  }`}
                >
                  <td className="px-4 py-2">
                    <button
                      aria-label="Expand"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-2">{org.fullName}</td>
                  <td className="px-4 py-2">{org.inn}</td>
                  <td className="px-4 py-2">{org.ogrnip ?? ''}</td>
                  <td className="px-4 py-2">{org.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end mt-4 space-x-2 text-gray-600">
        <button className="p-1 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}