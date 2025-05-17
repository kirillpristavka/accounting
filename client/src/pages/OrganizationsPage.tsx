// src/pages/OrganizationsPage.tsx
import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  FileText,
  Mail,
  List,
  Paperclip,
  Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Organization {
  name: string;
  inn: string;
  kpp: string;
  status: string;
}

const mockData: Organization[] = [
  { name: 'Приставка К. А.', inn: '312334094398', kpp: '', status: '' },
];

const OrganizationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-gray-50 flex-1">
      {/* Header */}
      <div className="flex items-center mb-4 space-x-2">
        <button className="p-2 bg-white border rounded">
          <ChevronLeft size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <ChevronRight size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <Star size={16} />
        </button>
        <h1 className="text-xl font-semibold ml-2">Организации</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center mb-4 space-x-2">
        <button onClick={() => navigate("/organizations/create")} className="px-3 py-1 bg-white border rounded flex items-center">
          Создать
          <ChevronDown size={16} className="ml-1" />
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
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left font-medium">Наименование в программе</th>
              <th className="p-2 text-left font-medium">ИНН</th>
              <th className="p-2 text-left font-medium">КПП</th>
              <th className="p-2 text-left font-medium">Статус регистрации</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((org, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 even:bg-gray-50"
              >
                <td className="p-2">{org.name}</td>
                <td className="p-2">{org.inn}</td>
                <td className="p-2">{org.kpp || '-'}</td>
                <td className="p-2">{org.status || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationsPage;
