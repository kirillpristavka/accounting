// src/pages/NomenclaturePage.tsx
import React from 'react';
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
} from 'lucide-react';

interface NomenclatureItem {
  id: number;
  name: string;
  sku: string;
  unit: string;
  vat: number;
  comment: string;
}

// Пока без данных
const mockData: NomenclatureItem[] = [];

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
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="p-2 bg-gray-50 flex-1 overflow-auto">
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

      {/* Вкладки: одна строка, no-wrap */}
      <nav className="flex flex-nowrap space-x-4 border-b border-gray-200 mb-4 overflow-x-auto">
        {tabLabels.map((label, idx) => (
          <button
            key={label}
            onClick={() => setActiveTab(idx)}
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

      {/* Таблица и панель действий только для Основное */}
      {activeTab === 0 ? (
        <>
          {/* Панель действий */}
          <div className="flex flex-wrap items-center mb-4 space-x-2">
            <button
              onClick={() => navigate('/nomenclature/create')}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-100 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Создать
            </button>
            <button
              onClick={() => {/* логика создания группы */}}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-100 flex items-center"
            >
              <FolderPlus size={16} className="mr-1" />
              Создать группу
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
                {mockData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Данных нет
                    </td>
                  </tr>
                ) : (
                  mockData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 even:bg-gray-50">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.sku}</td>
                      <td className="p-2">{item.unit}</td>
                      <td className="p-2">{item.vat}%</td>
                      <td className="p-2">{item.comment}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Заглушки для остальных вкладок
        <div className="p-6 text-gray-600">
          Раздел «{tabLabels[activeTab]}» пока не реализован.
        </div>
      )}
    </div>
  );
};

export default NomenclaturePage;