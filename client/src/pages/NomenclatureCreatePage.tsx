// src/pages/NomenclatureCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Save,
  List,
  Paperclip,
  Printer,
  ChevronDown,
} from 'lucide-react';

const tabLabels = [
  'Основное',
  'Правила определения счетов учета',
  'Спецификации',
  'Назначения использования номенклатуры',
  'Идентификаторы маркетплейсов',
  'Идентификаторы сайта',
  'Штрихкоды',
];

const nomenclatureTypes = [
  'Возвратная тара',
  'Малоценное оборудование и запасы',
  'Материалы',
  'Оборудование (объекты основных средств)',
  'Оборудование к установке',
  'Полуфабрикаты',
  'Продукция',
  'Продукция из материалов заказчика',
  'Товары',
  'Товары на комиссии',
  'Товары на ответственном хранении',
  'Топливо',
  'Услуги',
];

const NomenclatureCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-4 bg-gray-50 flex-1 overflow-auto">
      {/* навигация и заголовок */}
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
        <h1 className="text-xl font-semibold ml-2">Номенклатура (создание)</h1>
      </div>

      {/* внутренние вкладки */}
      <nav className="flex flex-nowrap space-x-4 border-b border-gray-200 mb-6 overflow-x-auto">
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

      {/* тулбар только для "Основное" */}
      {activeTab === 0 && (
        <div className="flex items-center mb-6 space-x-2">
          <button
            onClick={() => {/* TODO: save & close */}}
            className="px-3 py-1 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500"
          >
            Записать и закрыть
          </button>
          <button className="px-3 py-1 bg-white border rounded flex items-center hover:bg-gray-100">
            <Save size={16} className="mr-1" /> Записать
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <List size={16} />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <Paperclip size={16} />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <Printer size={16} />
          </button>
          <button className="flex items-center px-2 py-1 bg-white border rounded hover:bg-gray-100">
            Печать <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* контент вкладок */}
      <div className="bg-white border rounded p-4 space-y-6 w-full">
        {activeTab === 0 ? (
          <>
            <div className="max-w-2xl space-y-4">
              {/* Вид номенклатуры */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Вид номенклатуры:</label>
                <select className="flex-1 border px-2 rounded">
                  <option value="">— выберите тип —</option>
                  {nomenclatureTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Наименование */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Наименование:</label>
                <input type="text" className="flex-1 border px-2 rounded" />
              </div>

              {/* Полное наименование */}
              <div className="flex items-start space-x-4">
                <label className="w-1/3 pt-2 text-sm font-medium">Полное наименование:</label>
                <textarea className="flex-1 border px-2 rounded" rows={2} />
              </div>

              {/* Вид маркировки */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Вид маркировки:</label>
                <select className="flex-1 border px-2 rounded">
                  <option>Нет</option>
                </select>
              </div>

              {/* Артикул */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Артикул:</label>
                <input type="text" className="flex-1 border px-2 rounded" />
              </div>

              {/* Входит в группу */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Входит в группу:</label>
                <select className="flex-1 border px-2 rounded">
                  <option>—</option>
                </select>
              </div>

              {/* Единица */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Единица:</label>
                <select className="w-32 border px-2 rounded">
                  <option>шт</option>
                </select>
              </div>

              {/* % НДС */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">% НДС:</label>
                <select className="flex-1 border px-2 rounded">
                  <option>20%</option>
                </select>
                <a href="#" className="text-sm text-blue-600 hover:underline">История</a>
              </div>

              {/* Страна происхождения */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Страна происхождения:</label>
                <select className="flex-1 border px-2 rounded">
                  <option>РОССИЯ</option>
                </select>
              </div>

              {/* Производитель */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Производитель:</label>
                <select className="flex-1 border px-2 rounded">
                  <option>—</option>
                </select>
              </div>

              {/* Комментарий */}
              <div className="flex items-center space-x-4">
                <label className="w-1/3 text-sm font-medium">Комментарий:</label>
                <input type="text" className="flex-1 border px-2 rounded" />
              </div>

              {/* Скрывать в списках */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="hide" className="h-4 w-4" />
                <label htmlFor="hide" className="text-sm">Скрывать в списках</label>
                <button type="button" className="text-sm text-blue-600 hover:underline">?</button>
              </div>
            </div>

            {/* коллапс‑секции */}
            {['Описание', 'Производство', 'Классификация'].map((section, i) => (
              <details key={i} className="pt-2">
                <summary className="text-green-600 cursor-pointer">{section}</summary>
                <div className="mt-2 text-gray-600">Содержимое раздела «{section}»…</div>
              </details>
            ))}
          </>
        ) : (
          <div className="p-6 text-gray-600">
            Раздел «{tabLabels[activeTab]}» временно не реализован.
          </div>
        )}
      </div>
    </div>
  );
};

export default NomenclatureCreatePage;