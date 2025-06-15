// src/pages/NomenclaturePage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  FolderPlus,
  List,
  FileText,
  Link2,
  UploadCloud,
  DownloadCloud,
  Printer,
  Search as SearchIcon,
  MoreHorizontal,
  HelpCircle,
  Trash2,
} from 'lucide-react';

interface NomenclatureItem {
  id: number;
  name: string;
  sku: string;
  unit: string;
  vat: number;
  comment: string;
}

const tabLabels = [
  'Основное',
  'Виды номенклатуры',
  'Счета учета номенклатуры',
  'Типы цен номенклатуры',
  'Сведения об алкогольной продукции',
  'Шаблоны ценников и этикеток',
];

const NomenclaturePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const [items, setItems] = useState<NomenclatureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get<NomenclatureItem[]>('/api/nomenclature')
      .then(res => setItems(res.data))
      .catch(err => {
        console.error(err);
        setError('Ошибка при загрузке данных');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const handleDelete = async () => {
    if (selectedId == null) return;
    try {
      await axios.delete(`/api/nomenclature/${selectedId}`);
      setItems(prev => prev.filter(item => item.id !== selectedId));
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="p-4 flex-1">
      {/* Хлебные крошки / заголовок */}
      <div className="flex items-center mb-4 space-x-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded">
          <ChevronLeft size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <ChevronRight size={16} />
        </button>
        <button className="p-2 bg-white border rounded">
          <Star size={16} />
        </button>
        <h1 className="text-xl font-semibold ml-2">Номенклатура</h1>
      </div>

      {/* Вкладки */}
      <nav className="flex flex-nowrap space-x-4 border-b border-gray-200 mb-4 overflow-x-auto">
        {tabLabels.map((label, idx) => (
          <button
            key={label}
            onClick={() => {
              setActiveTab(idx);
              setSelectedId(null);
            }}
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
          {/* Панель действий */}
          <div className="flex flex-wrap items-center mb-4 space-x-2">
            <button
              onClick={() => navigate('/nomenclature/create')}
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
              <List size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <FileText size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <Link2 size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <UploadCloud size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <DownloadCloud size={16} />
            </button>
            <button className="p-2 bg-white border rounded hover:bg-gray-100">
              <Printer size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedId}
              className="p-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
              title="Удалить выбранную запись"
            >
              <Trash2 size={16} className={selectedId ? 'text-red-600' : 'text-gray-600'} />
            </button>
            <div className="flex items-center ml-auto space-x-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск (Ctrl+F)"
                  className="border px-2 py-1 rounded pl-8 w-48 focus:outline-none focus:ring"
                />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <button className="p-2 bg-white border rounded hover:bg-gray-100">
                <MoreHorizontal size={16} />
              </button>
              <button className="p-2 bg-white border rounded hover:bg-gray-100">
                <HelpCircle size={16} />
              </button>
            </div>
          </div>

          {/* Таблица */}
          <div className="overflow-auto bg-white border rounded shadow-sm">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Загрузка...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Данных нет</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left font-medium">Наименование</th>
                    <th className="p-2 text-left font-medium">Артикул</th>
                    <th className="p-2 text-left font-medium">Единица</th>
                    <th className="p-2 text-left font-medium">% НДС</th>
                    <th className="p-2 text-left font-medium">Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      onDoubleClick={() => navigate(`/nomenclature/${item.id}/edit`)}
                      className={`cursor-pointer hover:bg-gray-50 even:bg-gray-50 ${
                        selectedId === item.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.sku}</td>
                      <td className="p-2">{item.unit}</td>
                      <td className="p-2">{item.vat}%</td>
                      <td className="p-2">{item.comment}</td>
                    </tr>
                  ))}
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

export default NomenclaturePage;