// src/pages/ContragentsPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  FolderPlus,
  List as ListIcon,
  FileText,
  RefreshCcw,
  Paperclip,
  Trash2,
  X,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Contragent {
  id: number;
  name: string;
  inn?: string;
  responsible?: string;
  fullName?: string;
  tags?: string;
  edo?: string;
}

const tabLabels = [
  'Основное',
  'Счета расчетов с контрагентами',
];

const ContragentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { closeTab } = useAppContext();

  const [activeTab, setActiveTab] = useState(0);
  const [contragents, setContragents] = useState<Contragent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get<Contragent[]>('/api/contragents')
      .then(res => setContragents(res.data))
      .catch(err => {
        console.error(err);
        setError('Ошибка при загрузке контрагентов');
      })
      .finally(() => setLoading(false));
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

  const handleClose = () => {
    closeTab(location.pathname);
    navigate(-1);
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
        <div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Закрыть"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex flex-nowrap space-x-4 border-b border-gray-200 mb-4 overflow-x-auto">
        {tabLabels.map((label, idx) => (
          <button
            key={label}
            onClick={() => { setActiveTab(idx); setSelectedId(null); }}
            className={`whitespace-nowrap pb-2 text-sm ${
              activeTab === idx
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 0 ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center mb-4 space-x-2">
            <button
              onClick={() => navigate('/contragents/create')}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-100 flex items-center"
            >
              <Plus size={16} className="mr-1" /> Создать
            </button>
            <button
              onClick={() => {/* логика создания группы */}}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-100 flex items-center"
            >
              <FolderPlus size={16} className="mr-1" /> Создать группу
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <ListIcon size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <FileText size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <RefreshCcw size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <Paperclip size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedId}
              title="Удалить выбранного"
              className="p-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <Trash2 size={16} className={selectedId ? 'text-red-600' : 'text-gray-600'} />
            </button>
            <div className="flex items-center ml-auto space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm">Метки:</label>
                <input type="checkbox" className="form-checkbox" />
                <input
                  type="text"
                  placeholder="Фильтр по меткам"
                  className="border px-2 py-1 rounded"
                />
                <select className="border px-2 py-1 rounded">
                  <option>Все</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm">Ответственный:</label>
                <input type="checkbox" className="form-checkbox" />
                <input
                  type="text"
                  placeholder="Выбрать"
                  className="border px-2 py-1 rounded"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto bg-white border rounded shadow-sm">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Загрузка...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left font-medium">Наименование в программе</th>
                    <th className="p-2 text-left font-medium">ИНН</th>
                    <th className="p-2 text-left font-medium">Ответственный</th>
                    <th className="p-2 text-left font-medium">Полное наименование</th>
                    <th className="p-2 text-left font-medium">Метки</th>
                    <th className="p-2 text-left font-medium">ЭДО</th>
                  </tr>
                </thead>
                <tbody>
                  {contragents.map(item => {
                    const isActive = item.id === selectedId;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(prev => (prev === item.id ? null : item.id))}
                        onDoubleClick={() => navigate(`/contragents/${item.id}/edit`)}
                        className={`cursor-pointer hover:bg-gray-50 even:bg-gray-50 ${isActive ? 'bg-blue-100' : ''}`}
                      >
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.inn || '-'}</td>
                        <td className="p-2">{item.responsible || '-'}</td>
                        <td className="p-2">{item.fullName || '-'}</td>
                        <td className="p-2">{item.tags || '-'}</td>
                        <td className="p-2">{item.edo || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div className="p-6 text-gray-600">
          Раздел «{tabLabels[activeTab]}» пока не реализован.
        </div>
      )}
    </div>
  );
};

export default ContragentsPage;