// src/pages/OrganizationCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  Save,
  FileText,
  Mail,
  List,
  Paperclip,
  Archive
} from 'lucide-react';

const tabs = [
  'Основное',
  'Подразделения',
  'Банковские счета',
  'Учетная политика',
  'Лимиты остатка кассы',
  'Регистрации в налоговых органах',
];

const OrganizationCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // локальное состояние для «Вид» и «Статус»
  const [type, setType] = useState<'Физическое лицо' | 'Юридическое лицо'>('Физическое лицо');
  const [status, setStatus] = useState<'Самозанятый' | 'ИП' >('Самозанятый');

  // 1. Состояния для ФИО
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');

  // 2. Считаем полное имя
  const fullName = [lastName, firstName, middleName].filter(Boolean).join(' ');

  // В начале компонента, рядом с остальными useState:
  const [taxation, setTaxation] = useState<
    'Налог на профессиональный доход ("самозанятые")' |
    'УСН (доходы)' |
    'УСН (доходы минус расходы)' |
    'АУСН (доходы)' |
    'АУСН (доходы минус расходы)' |
    'Только патент' |
    'Общая'
  >('Налог на профессиональный доход ("самозанятые")');

  return (
    <div className="p-4 bg-gray-50 flex-1 overflow-auto">
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
        <h1 className="text-xl font-semibold ml-2">Организация (создание)</h1>
      </div>

      {/* Вкладки */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4 pl-2">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`pb-2 font-medium ${
              idx === 0
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Панель действий */}
      <div className="flex items-center mb-6 space-x-2">
        <button
          onClick={() => {/* здесь можно добавить submit-логику */}}
          className="px-3 py-1 bg-yellow-400 text-black font-medium rounded shadow-sm hover:bg-yellow-500"
        >
          Записать и закрыть
        </button>
        <button className="px-3 py-1 bg-white border rounded flex items-center hover:bg-gray-100">
          <Save size={16} className="mr-1" />
          Записать
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <FileText size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <Mail size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <List size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <Paperclip size={16} />
        </button>
        <button className="p-2 bg-white border rounded hover:bg-gray-100">
          <Archive size={16} />
        </button>
        <button className="flex items-center px-2 py-1 bg-white border rounded hover:bg-gray-100">
          ЭДО
          <ChevronDown size={16} className="ml-1" />
        </button>
      </div>

      {/* Форма */}
      <div className="bg-white border rounded p-4 space-y-6">
        {/* Вид и Статус */}
        <div className="grid grid-cols-2 gap-4">
          {/* Вид */}
          <div>
            <label className="block text-sm font-medium mb-1">Вид:</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={type}
              onChange={e => {
                const val = e.target.value as 'Физическое лицо' | 'Юридическое лицо';
                setType(val);
                // сбросим или оставим статус по умолчанию
                setStatus(val === 'Физическое лицо' ? 'Самозанятый' : 'ИП');
              }}
            >
              <option value="Физическое лицо">Физическое лицо</option>
              <option value="Юридическое лицо">Юридическое лицо</option>
            </select>
          </div>

          {/* Статус: рендерим только если ФЛ */}
          {type === 'Физическое лицо' && (
            <div>
              <label className="block text-sm font-medium mb-1">Статус:</label>
              <select
                className="w-full border px-2 py-1 rounded"
                value={status}
                onChange={e => setStatus(e.target.value as 'Самозанятый' | 'ИП')}
              >
                <option value="Самозанятый">Самозанятый</option>
                <option value="ИП">ИП</option>
              </select>
            </div>
          )}
        </div>

        {/* ФИО */}
        <div className="grid grid-cols-3 gap-4">
          {/* Фамилия */}
          <div>
            <label className="block text-sm font-medium mb-1">Фамилия:</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              placeholder="Фамилия"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium mb-1">Имя:</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              placeholder="Имя"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          {/* Отчество */}
          <div>
            <label className="block text-sm font-medium mb-1">Отчество:</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              placeholder="Отчество"
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
            />
          </div>
        </div>

        {/* Наименование */}
        <div>
          <label className="block text-sm font-medium mb-1">Наименование:</label>
          <div
            className={`text-sm ${
              fullName ? 'text-gray-800' : 'text-red-600'
            }`}
          >
            {fullName || '<Не заполнено ФИО>'}
          </div>
        </div>

        {/* Префикс и ИНН */}
        
        <div>
          <label className="block text-sm font-medium mb-1">Префикс:</label>
          <div className="flex items-center">
            <input type="text" className="border px-2 py-1 rounded" />
            <span className="text-blue-600 ml-2 cursor-pointer">?</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ИНН:</label>
          <div className="flex items-center">
            <input type="text" className="border px-2 py-1 rounded" />
            <span className="text-blue-600 ml-2 cursor-pointer">?</span>
          </div>
        </div>
        

        {/* Налогообложение */}
        <div>
          <label className="block text-sm font-medium mb-1">Налогообложение:</label>
          <select
            className="border px-2 py-1 rounded"
            value={taxation}
            onChange={e => setTaxation(e.target.value as any)}
          >
            {status === 'Самозанятый' ? (
              // только одна опция, если статус — «Самозанятый»
              <option value='Налог на профессиональный доход ("самозанятые")'>
                Налог на профессиональный доход ("самозанятые")
              </option>
            ) : (
              // в остальных случаях — полный набор
              <>
                <option value='Налог на профессиональный доход ("самозанятые")'>
                  Налог на профессиональный доход ("самозанятые")
                </option>
                <option value="УСН (доходы)">УСН (доходы)</option>
                <option value="УСН (доходы минус расходы)">УСН (доходы минус расходы)</option>
                <option value="АУСН (доходы)">АУСН (доходы)</option>
                <option value="АУСН (доходы минус расходы)">АУСН (доходы минус расходы)</option>
                <option value="Только патент">Только патент</option>
                <option value="Общая">Общая</option>
              </>
            )}
          </select>
        </div>

        {/* Основной банковский счет — теперь collapsible */}
        <details className="pt-2">
          <summary className="text-green-600 cursor-pointer">
            Основной банковский счет
          </summary>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Банк:</label>
              <select className="w-full border px-2 py-1 rounded">
                <option disabled selected>БИК или наименование</option>
                {/* …опции банка… */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Номер счета:</label>
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                placeholder="Номер счета"
              />
            </div>
          </div>
        </details>

        {/* Коллапс-секции */}
        {['Адрес и телефон', 'Логотип и печать', 'Налоговая инспекция'].map((section, idx) => (
          <details key={idx} className="pt-2">
            <summary className="text-green-600 cursor-pointer">{section}</summary>
            {/* Здесь можно добавить содержимое секции */}
          </details>
        ))}
      </div>
    </div>
  );
};

export default OrganizationCreatePage;