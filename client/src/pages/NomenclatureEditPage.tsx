// src/pages/NomenclatureEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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

interface NomenclatureItem {
  id: number;
  type: string;
  name: string;
  fullName: string;
  marking: string;
  article: string;
  group: string;
  unit: string;
  vat: string;
  country: string;
  manufacturer: string;
  comment: string;
  hideInLists: boolean;
}

const NomenclatureEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [marking, setMarking] = useState('Нет');
  const [article, setArticle] = useState('');
  const [group, setGroup] = useState('');
  const [unit, setUnit] = useState('шт');
  const [vat, setVat] = useState('20%');
  const [country, setCountry] = useState('РОССИЯ');
  const [manufacturer, setManufacturer] = useState('');
  const [comment, setComment] = useState('');
  const [hideInLists, setHideInLists] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get<NomenclatureItem>(`/api/nomenclature/${id}`)
      .then(res => {
        const d = res.data;
        setType(d.type);
        setName(d.name);
        setFullName(d.fullName);
        setMarking(d.marking);
        setArticle(d.article);
        setGroup(d.group);
        setUnit(d.unit);
        setVat(d.vat);
        setCountry(d.country);
        setManufacturer(d.manufacturer);
        setComment(d.comment);
        setHideInLists(d.hideInLists);
      })
      .catch(() => {
        setError('Не удалось загрузить номенклатуру');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveAndClose = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await axios.put(`/api/nomenclature/${id}`, {
        type,
        name,
        fullName,
        marking,
        article,
        group,
        unit,
        vat,
        country,
        manufacturer,
        comment,
        hideInLists,
      });
      navigate(-1);
    } catch {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Загрузка…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 flex-1">
      {/* Навигация и заголовок */}
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
        <h1 className="text-xl font-semibold ml-2">Редактировать номенклатуру</h1>
      </div>

      {/* Вкладки */}
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

      {/* Тулбар только на "Основное" */}
      {activeTab === 0 && (
        <div className="flex items-center mb-6 space-x-2">
          <button
            onClick={handleSaveAndClose}
            disabled={saving}
            className="px-3 py-1 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500 disabled:opacity-50"
          >
            Записать и закрыть
          </button>
          <button
            onClick={handleSaveAndClose}
            disabled={saving}
            className="px-3 py-1 bg-white border rounded flex items-center hover:bg-gray-100 disabled:opacity-50"
          >
            <Save size={16} className="mr-1" /> Записать
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100"><List size={16} /></button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100"><Paperclip size={16} /></button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100"><Printer size={16} /></button>
          <button className="flex items-center px-2 py-1 bg-white border rounded hover:bg-gray-100">
            Печать <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* Контент вкладок */}
      <div className="bg-white border rounded p-4 space-y-6 w-full">
        {activeTab === 0 ? (
          <div className="max-w-2xl space-y-4">
            {/* Вид номенклатуры */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Вид номенклатуры:</label>
              <select
                className="flex-1 border px-2 rounded"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="">— выберите тип —</option>
                {nomenclatureTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Наименование */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Наименование:</label>
              <input
                type="text"
                className="flex-1 border px-2 rounded"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {/* Полное наименование */}
            <div className="flex items-start space-x-4">
              <label className="w-1/3 pt-2 text-sm font-medium">Полное наименование:</label>
              <textarea
                className="flex-1 border px-2 rounded"
                rows={2}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            {/* Вид маркировки */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Вид маркировки:</label>
              <select
                className="flex-1 border px-2 rounded"
                value={marking}
                onChange={e => setMarking(e.target.value)}
              >
                <option>Нет</option>
              </select>
            </div>

            {/* Артикул */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Артикул:</label>
              <input
                type="text"
                className="flex-1 border px-2 rounded"
                value={article}
                onChange={e => setArticle(e.target.value)}
              />
            </div>

            {/* Входит в группу */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Входит в группу:</label>
              <select
                className="flex-1 border px-2 rounded"
                value={group}
                onChange={e => setGroup(e.target.value)}
              >
                <option>—</option>
              </select>
            </div>

            {/* Единица */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Единица:</label>
              <select
                className="w-32 border px-2 rounded"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option>шт</option>
              </select>
            </div>

            {/* % НДС */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">% НДС:</label>
              <select
                className="flex-1 border px-2 rounded"
                value={vat}
                onChange={e => setVat(e.target.value)}
              >
                <option>20%</option>
              </select>
            </div>

            {/* Страна происхождения */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Страна происхождения:</label>
              <select
                className="flex-1 border px-2 rounded"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option>РОССИЯ</option>
              </select>
            </div>

            {/* Производитель */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Производитель:</label>
              <select
                className="flex-1 border px-2 rounded"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
              >
                <option>—</option>
              </select>
            </div>

            {/* Комментарий */}
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium">Комментарий:</label>
              <input
                type="text"
                className="flex-1 border px-2 rounded"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            {/* Скрывать в списках */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hide"
                className="h-4 w-4"
                checked={hideInLists}
                onChange={e => setHideInLists(e.target.checked)}
              />
              <label htmlFor="hide" className="text-sm">Скрывать в списках</label>
            </div>

            {/* Коллапс‑секции */}
            {['Описание', 'Производство', 'Классификация'].map((section, i) => (
              <details key={i} className="pt-2">
                <summary className="text-green-600 cursor-pointer">{section}</summary>
                <div className="mt-2 text-gray-600">
                  Содержимое раздела «{section}»…
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="p-6 text-gray-600">
            Раздел «{tabLabels[activeTab]}» временно не реализован.
          </div>
        )}
      </div>
    </div>
  );
};

export default NomenclatureEditPage;