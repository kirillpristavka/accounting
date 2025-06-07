// src/pages/OrganizationCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  ChevronDown,
  Save,
  FileText,
  Mail,
  List,
  Paperclip,
  Archive,
} from 'lucide-react';
import { useOrganizationCreate } from '../stores/useOrganizationCreate';
import { useAppContext } from '../context/AppContext';

axios.defaults.baseURL = 'http://localhost:4000';

const tabLabels = [
  'Основное',
  'Подразделения',
  'Банковские счета',
  'Учетная политика',
  'Лимиты остатка кассы',
  'Регистрации в налоговых органах',
];

const OrganizationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { closeTab } = useAppContext();

  const [activeTab, setActiveTab] = useState(0);

  const {
    type,
    status,
    lastName,
    firstName,
    middleName,
    prefix,
    inn,
    taxation,
    showPrefixTip,
    showInnTip,
    setType,
    setStatus,
    setLastName,
    setFirstName,
    setMiddleName,
    setPrefix,
    setInn,
    setTaxation,
    setShowPrefixTip,
    setShowInnTip,
    resetForm,
  } = useOrganizationCreate();

  // «Фамилия И.О.»
  const fullName = lastName
    ? `${lastName.trim()} ${
        firstName ? firstName.trim()[0].toUpperCase() + '.' : ''
      }${middleName ? middleName.trim()[0].toUpperCase() + '.' : ''}`
    : '';

  const handleSaveAndClose = async () => {
    try {
      await axios.post('/api/organizations', {
        type: type === 'Физическое лицо' ? 'PHYSICAL' : 'LEGAL',
        ...(type === 'Физическое лицо' && {
          physicalType: status === 'Самозанятый' ? 'SELF_EMPLOYED' : 'IP',
        }),
        lastName,
        firstName,
        middleName,
        name: fullName,
        prefix,
        inn,
        taxation,
      });
      resetForm();
      closeTab(location.pathname);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении организации');
    }
  };

  const handleBack = () => navigate(-1);

  const handleClose = () => {
    resetForm();
    closeTab(location.pathname);
    navigate(-1);
  };

  return (
    <div className="p-4 bg-gray-50 overflow-auto">
      {/* Навигация и заголовок */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={handleBack} className="p-2 bg-white border">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 bg-white border">
            <ChevronRight size={16} />
          </button>
          <button className="p-2 bg-white border">
            <Star size={16} />
          </button>
          <h1 className="text-xl font-semibold ml-2">Организация (создание)</h1>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100"
          title="Закрыть"
        >
          <X size={16} />
        </button>
      </div>

      {/* Вкладки */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6 pl-2">
        {tabLabels.map((label, idx) => (
          <button
            key={label}
            className={`pb-2 font-medium ${
              activeTab === idx
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Тулбар для «Основное» */}
      {activeTab === 0 && (
        <div className="flex items-center mb-6 space-x-2">
          <button
            onClick={handleSaveAndClose}
            className="px-3 py-1 bg-yellow-400 text-black font-medium shadow-sm hover:bg-yellow-500"
          >
            Записать и закрыть
          </button>
          <button className="px-3 py-1 bg-white border flex items-center hover:bg-gray-100">
            <Save size={16} className="mr-1" />
            Записать
          </button>
          <button className="p-2 bg-white border hover:bg-gray-100">
            <FileText size={16} />
          </button>
          <button className="p-2 bg-white border hover:bg-gray-100">
            <Mail size={16} />
          </button>
          <button className="p-2 bg-white border hover:bg-gray-100">
            <List size={16} />
          </button>
          <button className="p-2 bg-white border hover:bg-gray-100">
            <Paperclip size={16} />
          </button>
          <button className="p-2 bg-white border hover:bg-gray-100">
            <Archive size={16} />
          </button>
          <button className="flex items-center px-2 py-1 bg-white border hover:bg-gray-100">
            ЭДО <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* Контент вкладок */}
      <div className="bg-white border p-4">
        {activeTab === 0 && (
          <div className="space-y-2">
            {/* Вид */}
            <div className="flex items-center">
              <label htmlFor="type" className="w-40 text-sm font-medium">
                Вид:
              </label>
              <select
                id="type"
                className="border px-1"
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                <option>Физическое лицо</option>
                <option>Юридическое лицо</option>
              </select>
            </div>

            {/* Статус */}
            {type === 'Физическое лицо' && (
              <div className="flex items-center">
                <label htmlFor="status" className="w-40 text-sm font-medium">
                  Статус:
                </label>
                <select
                  id="status"
                  className="border px-1"
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                >
                  <option>Самозанятый</option>
                  <option>ИП</option>
                </select>
              </div>
            )}

            {/* ФИО */}
            {[
              { id: 'lastName', label: 'Фамилия', value: lastName, onChange: setLastName },
              { id: 'firstName', label: 'Имя', value: firstName, onChange: setFirstName },
              { id: 'middleName', label: 'Отчество', value: middleName, onChange: setMiddleName },
            ].map(fld => (
              <div key={fld.id} className="flex items-center">
                <label htmlFor={fld.id} className="w-40 text-sm font-medium">
                  {fld.label}:
                </label>
                <input
                  id={fld.id}
                  type="text"
                  className="border px-1"
                  placeholder={fld.label}
                  value={fld.value}
                  onChange={e => fld.onChange(e.target.value)}
                />
              </div>
            ))}

            {/* Наименование */}
            <div className="flex items-center">
              <label className="w-40 text-sm font-medium">Наименование:</label>
              <div className={`flex-1 text-sm ${fullName ? 'text-gray-800' : 'text-red-600'}`}>
                {fullName || '<Не заполнено ФИО>'}
              </div>
            </div>

            {/* Префикс */}
            <div className="relative flex items-start ">
              <label className="w-40 text-sm font-medium">Префикс:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="border px-1 w-40"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowPrefixTip(!showPrefixTip)}
                >
                  ?
                </button>
              </div>
              {showPrefixTip && (
                <div className="absolute top-full left-40 mt-1 w-80 bg-yellow-100 border border-gray-300 p-3 text-sm shadow-lg z-10">
                  Префикс включается в состав номера документа…
                </div>
              )}
            </div>

            {/* ИНН */}
            <div className="relative flex items-start">
              <label className="w-40 text-sm font-medium">ИНН:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 border px-1"
                  placeholder="ИНН"
                  value={inn}
                  onChange={e => setInn(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowInnTip(!showInnTip)}
                >
                  ?
                </button>
              </div>
              {showInnTip && (
                <div className="absolute top-full left-40 mt-1 w-96 bg-yellow-100 border border-gray-300 p-3 text-sm shadow-lg z-10">
                  Идентификатор налогоплательщика (ИНН)…
                </div>
              )}
            </div>

            {/* Налогообложение */}
            <div className="flex items-center">
              <label className="w-40 text-sm font-medium">Налогообложение:</label>
              <select
                className="border px-1"
                value={taxation}
                onChange={e => setTaxation(e.target.value as any)}
              >
                {status === 'Самозанятый' ? (
                  <option>Налог на профессиональный доход ("самозанятые")</option>
                ) : (
                  <>
                    <option>Налог на профессиональный доход ("самозанятые")</option>
                    <option>УСН (доходы)</option>
                    <option>УСН (доходы минус расходы)</option>
                    <option>АУСН (доходы)</option>
                    <option>АУСН (доходы минус расходы)</option>
                    <option>Только патент</option>
                    <option>Общая</option>
                  </>
                )}
              </select>
            </div>

            {/* Секции */}
            <details>
              <summary className="text-green-600 cursor-pointer">
                Основной банковский счет
              </summary>
              <div className="mt-2 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium">Банк:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1"
                    placeholder="БИК или наименование"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium">Номер счета:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1"
                    placeholder="Номер счета"
                  />
                </div>
              </div>
            </details>

            {['Адрес и телефон', 'Логотип и печать', 'Налоговая инспекция'].map((section, i) => (
              <details key={i}>
                <summary className="text-green-600 cursor-pointer">{section}</summary>
                <div className="mt-2 text-gray-600">
                  {/* Содержимое раздела {section} */}
                </div>
              </details>
            ))}
          </div>
        )}

        {activeTab === 1 && <div className="p-4 text-gray-600">Раздел «Подразделения»</div>}
        {activeTab === 2 && <div className="p-4 text-gray-600">Раздел «Банковские счета»</div>}
        {activeTab === 3 && <div className="p-4 text-gray-600">Раздел «Учетная политика»</div>}
        {activeTab === 4 && <div className="p-4 text-gray-600">Раздел «Лимиты остатка кассы»</div>}
        {activeTab === 5 && (
          <div className="p-4 text-gray-600">Раздел «Регистрации в налоговых органах»</div>
        )}
      </div>
    </div>
  );
};

export default OrganizationCreatePage;