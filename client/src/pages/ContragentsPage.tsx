// src/pages/ContragentsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Trash2,
  FileText,
  Mail,
  List as ListIcon,
  Paperclip,
  Archive,
} from 'lucide-react';

interface Contragent {
  id: number;
  name: string;
  phone?: string;
  email?: string;
}

const ContragentsPage: React.FC = () => {
  const navigate = useNavigate();

  const [contragents, setContragents] = useState<Contragent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<Contragent[]>('/api/contragents');
        setContragents(res.data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить контрагентов');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedId == null) return;
    if (!window.confirm('Удалить выбранного контрагента?')) return;

    try {
      await axios.delete(`/api/contragents/${selectedId}`);
      setContragents(prev => prev.filter(c => c.id !== selectedId));
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="p-4 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => navigate(+1)} className="p-2 bg-white border rounded">
            <ChevronRight size={16} />
          </button>
          <button className="p-2 bg-white border rounded">
            <Star size={16} />
          </button>
          <h1 className="text-xl font-semibold ml-2">Контрагенты</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center mb-4 space-x-2">
        <button
          onClick={() => navigate('/contragents/create')}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-100 flex items-center"
        >
          <Plus size={16} className="mr-1" /> Создать
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedId}
          title="Удалить выбранного контрагента"
          className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50"
        >
          <Trash2 size={16} className={selectedId ? 'text-red-600' : 'text-gray-600'} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <FileText size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <Mail size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <ListIcon size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <Paperclip size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
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
                <th className="p-2 text-left font-medium">Телефон</th>
                <th className="p-2 text-left font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {contragents.map(c => {
                const isActive = c.id === selectedId;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(prev => (prev === c.id ? null : c.id))}
                    className={`cursor-pointer hover:bg-gray-50 even:bg-gray-50 ${
                      isActive ? 'bg-blue-100' : ''
                    }`}
                  >
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.phone || '-'}</td>
                    <td className="p-2">{c.email || '-'}</td>
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

export default ContragentsPage;