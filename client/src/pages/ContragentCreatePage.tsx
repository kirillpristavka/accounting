// src/pages/ContragentCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Save,
  List as ListIcon,
  Paperclip,
  FileText,
  Printer,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const tabLabels = [
  'Основное',
  'Документы',
  'Договоры',
  'Банковские счета',
  'Контактные лица',
  'Счета расчетов с контрагентами',
  'Лицензии поставщиков алкогольной продукции',
  'Задачи',
  'Еще',
];

const ContragentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { closeTab } = useAppContext();

  const [activeTab, setActiveTab] = useState(0);

  // form state
  const [type, setType] = useState('Юридическое лицо');
  const [docName, setDocName] = useState('');
  const [programName, setProgramName] = useState('');
  const [tags, setTags] = useState('');
  const [group, setGroup] = useState('');
  const [country, setCountry] = useState('РОССИЯ');
  const [inn, setInn] = useState('');
  const [kpp, setKpp] = useState('');
  const [ogrn, setOgrn] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [document, setDocument] = useState('');
  const [responsible, setResponsible] = useState('');
  const [comment, setComment] = useState('');

  const payload = {
    type,
    docName,
    programName,
    tags,
    group,
    country,
    inn,
    kpp,
    ogrn,
    registrationDate,
    document,
    responsible,
    comment,
  };

  const handleSave = async (close = false) => {
    try {
      await axios.post('/api/contragents', payload);
      if (close) {
        closeTab(location.pathname);
        navigate(-1);
      } else {
        alert('Контрагент сохранён');
      }
    } catch {
      alert('Ошибка при сохранении контрагента');
    }
  };

  const handleBack = () => navigate(-1);
  const handleClose = () => {
    closeTab(location.pathname);
    navigate(-1);
  };

  // показывать автозаполнение только для ЮЛ и ИП
  const dontShowAutofill = type === 'Физическое лицо' || type === 'Самозанятый';

  return (
    <div className="p-4 bg-gray-50 overflow-auto">
      {/* Навигация и заголовок */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={handleBack} className="p-2 bg-white border rounded">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 bg-white border rounded">
            <ChevronRight size={16} />
          </button>
          <button className="p-2 bg-white border rounded">
            <Star size={16} />
          </button>
          <h1 className="text-xl font-semibold ml-2">Контрагент (создание)</h1>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full"
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
            onClick={() => setActiveTab(idx)}
            className={`pb-2 text-sm font-medium ${
              activeTab === idx
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {label === 'Еще' ? 'Еще...' : label}
          </button>
        ))}
      </div>

      {/* Тулбар */}
      {activeTab === 0 && (
        <div className="flex items-center mb-6 space-x-2">
          <button
            onClick={() => handleSave(true)}
            className="px-3 py-1 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500"
          >
            Записать и закрыть
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-3 py-1 bg-white border flex items-center rounded hover:bg-gray-100"
          >
            <Save size={16} className="mr-1" /> Записать
          </button>
          <button className="flex items-center px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Заполнить <ChevronDown size={16} className="ml-1" />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <ListIcon size={16} />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <Paperclip size={16} />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <FileText size={16} />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <Printer size={16} />
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100">
            <Mail size={16} />
          </button>
        </div>
      )}

      {/* Содержимое вкладок */}
      <div className="w-full min-h-screen bg-white border box-border p-6 flex">
        {activeTab === 0 ? (
          <div className="w-1/2 space-y-4">

            {/* Автозаполнение */}
            {!dontShowAutofill && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="font-medium">
                  Автоматическое заполнение реквизитов по ИНН или наименованию:
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded bg-white"
                    placeholder="Введите ИНН или Наименование"
                  />
                  <button className="px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200">
                    Заполнить
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>
              </div>
            )}

            {/* Вид контрагента */}
            <div className="flex items-center space-x-4">
              <label className="w-40 text-sm font-medium">Вид контрагента:</label>
              <select
                className="flex-1 border px-2 py-1 rounded"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option>Юридическое лицо</option>
                <option>Индивидуальный предприниматель</option>
                <option>Физическое лицо</option>
                <option>Самозанятый</option>
                <option>Обособленное подразделение</option>
                <option>Государственный орган</option>
              </select>
            </div>

            {/* Юридическое лицо */}
            {type === 'Юридическое лицо' && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование для документов:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder='ООО "Ромашка"'
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование в программе:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Ромашка ООО"
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                  />
                  <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Метки:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">В группе:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Страна регистрации:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  >
                    <option>РОССИЯ</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ИНН:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите ИНН"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">КПП:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите КПП 9 цифр"
                    value={kpp}
                    onChange={e => setKpp(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ОГРН:</label>
                  <input
                    type="text"
                    className="flex-1 min-w-0 border px-2 py-1 rounded"
                    value={ogrn}
                    onChange={e => setOgrn(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">?</button>
                  <label className="text-sm font-medium">Дата регистрации:</label>
                  <input
                    type="date"
                    className="w-30 border px-2 py-1 rounded"
                    value={registrationDate}
                    onChange={e => setRegistrationDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Индивидуальный предприниматель */}
            {type === 'Индивидуальный предприниматель' && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование для документов:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="ИП Иванов Иван Иванович"
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование в программе:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Иванов И. И. ИП"
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                  />
                  <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Метки:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">В группе:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Страна регистрации:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  >
                    <option>РОССИЯ</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ИНН:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите ИНН"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ОГРНИП:</label>
                  <input
                    type="text"
                    className="flex-1 min-w-0 border px-2 py-1 rounded"
                    value={ogrn}
                    onChange={e => setOgrn(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">?</button>
                  <label className="text-sm font-medium">Дата регистрации:</label>
                  <input
                    type="date"
                    className="w-30 border px-2 py-1 rounded"
                    value={registrationDate}
                    onChange={e => setRegistrationDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Физическое лицо */}
            {type === 'Физическое лицо' && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование для документов:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Иванов Иван Иванович"
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование в программе:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Иванов И. И."
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                  />
                  <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Метки:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">В группе:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Страна регистрации:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  >
                    <option>РОССИЯ</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ИНН:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите ИНН"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Документ:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Документ, удостоверяющий личность"
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Самозанятый */}
            {type === 'Самозанятый' && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование для документов:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Иванов Иван Иванович"
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование в программе:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Иванов И. И."
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                  />
                  <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Метки:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">В группе:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ИНН:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите ИНН"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Документ:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Документ, удостоверяющий личность"
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                  />
                </div>
              </>
            )}

            {type === 'Обособленное подразделение' && (
              <>
                {/* Наименование */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование для документов:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder='ООО "Ромашка" — подразделение'
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Наименование в программе:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Ромашка ООО — подразделение"
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                  />
                  <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16}/>
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>

                {/* Метки и группа */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Метки:</label>
                  <select className="flex-1 border px-2 py-1 rounded" value={tags} onChange={e => setTags(e.target.value)}>
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">В группе:</label>
                  <select className="flex-1 border px-2 py-1 rounded" value={group} onChange={e => setGroup(e.target.value)}>
                    <option>—</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink size={16}/>
                  </button>
                </div>

                {/* Страна */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Страна регистрации:</label>
                  <select className="flex-1 border px-2 py-1 rounded" value={country} onChange={e => setCountry(e.target.value)}>
                    <option>РОССИЯ</option>
                  </select>
                </div>

                {/* Головной контрагент + ИНН головного */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Головной контрагент:</label>
                  <select className="flex-1 border px-2 py-1 rounded" /* сюда подтяните список головных */>
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ИНН головного:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded bg-gray-50"
                    placeholder="ИНН головного контрагента"
                    disabled
                  />
                </div>

                {/* КПП */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">КПП:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите КПП 9 цифр"
                    value={kpp}
                    onChange={e => setKpp(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>

                {/* ОГРН + дата */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ОГРН:</label>
                  <input
                    type="text"
                    className="flex-1 min-w-0 border px-2 py-1 rounded"
                    value={ogrn}
                    onChange={e => setOgrn(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">?</button>
                  <label className="text-sm font-medium">Дата регистрации:</label>
                  <input
                    type="date"
                    className="w-30 border px-2 py-1 rounded"
                    value={registrationDate}
                    onChange={e => setRegistrationDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {type === 'Государственный орган' && (
              <>
                {/* Наименование */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">
                    Наименование для документов:
                  </label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите наименование"
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">
                    Наименование в программе:
                  </label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите сокращённое наименование"
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                  />
                  <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                  <button className="text-blue-600 hover:underline">?</button>
                </div>

                {/* Метки и группа */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Метки:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">В группе:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  >
                    <option>—</option>
                  </select>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink size={16} />
                  </button>
                </div>

                {/* Сам выбор органа и его код */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Государственный орган:</label>
                  <select
                    className="flex-1 border px-2 py-1 rounded"
                    // value и onChange по вашему, например setResponsible
                  >
                    <option>—</option>
                  </select>
                  <label className="text-sm font-medium">Код:</label>
                  <input
                    type="text"
                    className="w-24 border px-2 py-1 rounded"
                    placeholder="Код"
                    // value и onChange по вашей логике
                  />
                </div>

                {/* ИНН, КПП */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ИНН:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите ИНН"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">КПП:</label>
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Введите КПП"
                    value={kpp}
                    onChange={e => setKpp(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">История</button>
                </div>

                {/* ОГРН и Дата регистрации точно как для ЮЛ */}
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">ОГРН:</label>
                  <input
                    type="text"
                    className="flex-1 min-w-0 border px-2 py-1 rounded"
                    value={ogrn}
                    onChange={e => setOgrn(e.target.value)}
                  />
                  <button className="text-blue-600 hover:underline">?</button>
                  <label className="text-sm font-medium">Дата регистрации:</label>
                  <input
                    type="date"
                    className="w-30 border px-2 py-1 rounded"
                    value={registrationDate}
                    onChange={e => setRegistrationDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Ответственный и Комментарий */}
            <div className="flex items-center space-x-4">
              <label className="w-40 text-sm font-medium">Ответственный:</label>  
              <select
                className="flex-1 border px-2 py-1 rounded"
                value={responsible}
                onChange={e => setResponsible(e.target.value)}
              >
                <option>—</option>
              </select>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ExternalLink size={16} />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-40 text-sm font-medium">Комментарий:</label>
              <input
                type="text"
                className="flex-1 border px-2 py-1 rounded"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            {/* Коллапсы */}
            {[
              'Основной банковский счет',
              'Адрес и телефон',
              'Контактное лицо',
              'Дополнительная информация',
            ].map((section, i) => (
              <details key={i} className="pt-2">
                <summary className="text-green-600 cursor-pointer">{section}</summary>
                <div className="mt-2 text-gray-600">
                  Содержимое раздела «{section}»…
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="w-1/2 p-4 text-gray-600">
            Раздел «{tabLabels[activeTab]}» временно не реализован.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContragentCreatePage;