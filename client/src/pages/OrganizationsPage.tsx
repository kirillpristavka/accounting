// src/pages/OrganizationsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  FileText,
  Mail,
  List,
  Paperclip,
  Archive
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  FaRegTrashAlt,     // FontAwesome (контурная корзина)
  FaPlus
} from 'react-icons/fa';

interface Organization {
  id: number;
  name: string;
  inn?: string;
  kpp?: string;
  status: string;
}

const OrganizationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  // ID выбранной строки
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get<Organization[]>('/api/organizations');
        setOrganizations(res.data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить список организаций');
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleDelete = async () => {
    if (selectedId == null) return;
    if (!window.confirm('Удалить выбранную организацию?')) return;

    try {
      await axios.delete(`/api/organizations/${selectedId}`);
      setOrganizations(orgs =>
        orgs.filter(o => o.id !== selectedId)
      );
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="p-4 bg-gray-50 flex-1">
      {/* Header */}
      <div className="flex items-center mb-4 space-x-2">
        <button onClick={() => {navigate(-1)}} className="p-2 bg-white border rounded">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => {navigate(+1)}} className="p-2 bg-white border rounded">
          <ChevronRight size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <Star size={16} />
        </button>
        <h1 className="text-xl font-semibold ml-2">Организации</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center mb-4 space-x-2">
        <button
          onClick={() => navigate('/organizations/create')}
          className="p-2 bg-white border border-green-600 rounded hover:bg-gray-100 text-green-600 flex items-center gap-2"
        >
          <FaPlus size={16} className="text-green-600" />
          Создать
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedId}
          title="Удалить выбранную организацию"
          className={`
            p-2 rounded hover:bg-gray-100 disabled:opacity-50
            ${selectedId 
              ? 'border border-red-600'   // красная, более жирная рамка
              : 'border border-gray-300'     // обычная серая тонкая рамка
            }
          `}
        >
          <FaRegTrashAlt
            size={16}
            className={selectedId ? 'text-red-600' : 'text-gray-600'}
          />
        </button>
        <button className="p-2 bg-white border rounded">
          <FileText size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <Mail size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <List size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <Paperclip size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <Archive size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white border rounded shadow-sm">
        {loading ? (
          <div className="p-4 text-center">Загрузка...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left font-medium">Наименование</th>
                <th className="p-2 text-left font-medium">ИНН</th>
                <th className="p-2 text-left font-medium">КПП</th>
                <th className="p-2 text-left font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => {
                const isActive = org.id === selectedId;
                return (
                  <tr
                    key={org.id}
                    onClick={() =>
                      setSelectedId(prev => (prev === org.id ? null : org.id))
                    }
                    className={`
                      cursor-pointer
                      hover:bg-gray-50
                      even:bg-gray-50
                      ${isActive ? 'bg-blue-100' : ''}
                    `}
                  >
                    <td className="p-2">{org.name}</td>
                    <td className="p-2">{org.inn || '-'}</td>
                    <td className="p-2">{org.kpp || '-'}</td>
                    <td className="p-2">{org.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrganizationsPage;