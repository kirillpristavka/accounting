// src/pages/OrganizationCreatePage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronDown,
  FileText,
  Printer,
  Mail,
  List,
  Paperclip,
  HelpCircle,
} from 'lucide-react';
import type { JSX } from 'react';

export default function OrganizationCreatePage(): JSX.Element {
  const navigate = useNavigate();

  // — Основные поля формы —
  const [view, setView] = useState<'Физическое лицо' | 'Юридическое лицо'>('Физическое лицо');
  const [status, setStatus] = useState<'Индивидуальный предприниматель' | 'ООО'>(
    'Индивидуальный предприниматель'
  );
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [fullName, setFullName] = useState('<Не заполнено>');
  const [prefix, setPrefix] = useState('');
  const [inn, setInn] = useState('');
  const [ogrnip, setOgrnip] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [certificate, setCertificate] = useState('');
  const [certificateDate, setCertificateDate] = useState('');

  // — Данные из API для секций —
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [addressFull, setAddressFull] = useState('');
  const [addressDate, setAddressDate] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [taxOfficeDate, setTaxOfficeDate] = useState('');
  const [pensionRegNumber, setPensionRegNumber] = useState('');
  const [pensionRegDate, setPensionRegDate] = useState('');
  const [pensionCode, setPensionCode] = useState('');
  const [fssRegNumber, setFssRegNumber] = useState('');
  const [fssRegDate, setFssRegDate] = useState('');
  const [fssCode, setFssCode] = useState('');
  const [okpo, setOkpo] = useState('');
  const [oktmo, setOktmo] = useState('');
  const [okfs, setOkfs] = useState('');
  const [okogu, setOkogu] = useState('');

  // — Статусы сохранения/ошибки —
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // — Заполнить реквизиты по ИНН через API ФНС —
  const handleFill = async () => {
    if (!inn) return;
    try {
      const params = new URLSearchParams({
        req: inn,
        key: '3d38845db210b09ee3c47847810088e9775edb38',
      });
      const res = await fetch(`https://api-fns.ru/api/egr?${params}`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const rec = data.items?.[0]?.ИП;
      if (rec) {
        // ФИО и наименование
        const parts = rec.ФИОПолн.split(' ');
        setSurname(parts[0] || '');
        setName(parts[1] || '');
        setPatronymic(parts[2] || '');
        setFullName(rec.ФИОПолн);

        // ОГРНИП и дата регистрации
        setOgrnip(rec.ОГРНИП);
        setRegistrationDate(rec.ДатаРег);

        // Серия и № свидетельства / Дата выдачи (оставляем ручными, можно взять из rec.История при необходимости)

        // Адрес
        setAddressFull(rec.Адрес?.АдресПолн || '');
        setAddressDate(rec.Адрес?.Дата || '');

        // Налоговая инспекция
        setTaxOffice(rec.НО?.Рег || '');
        setTaxOfficeDate(rec.НО?.РегДата || '');

        // Пенсионный фонд
        setPensionRegNumber(rec.ПФ?.РегНомПФ || '');
        setPensionRegDate(rec.ПФ?.ДатаРегПФ || '');
        setPensionCode(rec.ПФ?.КодПФ || '');

        // Фонд соц. страхования
        setFssRegNumber(rec.ФСС?.РегНомФСС || '');
        setFssRegDate(rec.ФСС?.ДатаРегФСС || '');
        setFssCode(rec.ФСС?.КодФСС || '');

        // Коды статистики
        setOkpo(rec.КодыСтат?.ОКПО || '');
        setOktmo(rec.КодыСтат?.ОКТМО || '');
        setOkfs(rec.КодыСтат?.ОКФС || '');
        setOkogu(rec.КодыСтат?.ОКОГУ || '');
      }
    } catch (e) {
      console.error('Ошибка получения реквизитов:', e);
    }
  };

  // — Сохранить организацию и закрыть —
  const handleSaveAndClose = async () => {
    setIsSaving(true);
    setError(null);

    const payload = {
      view,
      status,
      surname,
      name,
      patronymic,
      fullName,
      prefix,
      inn,
      ogrnip,
      registrationDate,
      certificate,
      certificateDate,
      bank: { name: bankName, account: bankAccount },
      address: { full: addressFull, date: addressDate },
      taxInspection: { office: taxOffice, date: taxOfficeDate },
      pension: { regNumber: pensionRegNumber, date: pensionRegDate, code: pensionCode },
      fss: { regNumber: fssRegNumber, date: fssRegDate, code: fssCode },
      statistics: { okpo, oktmo, okfs, okogu },
    };

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      navigate('/organizations');
    } catch (e: any) {
      console.error('Ошибка сохранения:', e);
      setError(e.message || 'Произошла неизвестная ошибка');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 flex-1 overflow-auto text-sm">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button disabled className="p-2 text-gray-400 rounded cursor-not-allowed">
            <ArrowRight className="w-5 h-5" />
          </button>
          <Star className="w-5 h-5 text-gray-600" />
          <h1 className="text-xl font-semibold">
            Организация (создание)<span className="text-red-600 ml-1">*</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveAndClose}
            disabled={isSaving}
            className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 disabled:opacity-50"
          >
            {isSaving ? 'Сохраняем…' : 'Записать и закрыть'}
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            Записать
          </button>
          <button title="Реквизиты" className="p-2 hover:bg-gray-100 rounded">
            <FileText className="w-5 h-5" />
          </button>
          <button title="Печать" className="p-2 hover:bg-gray-100 rounded">
            <Printer className="w-5 h-5" />
          </button>
          <button title="Email" className="p-2 hover:bg-gray-100 rounded">
            <Mail className="w-5 h-5" />
          </button>
          <button title="Список" className="p-2 hover:bg-gray-100 rounded">
            <List className="w-5 h-5" />
          </button>
          <button title="Прикрепить" className="p-2 hover:bg-gray-100 rounded">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            Подключение к 1С‑Отчетности
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded flex items-center hover:bg-gray-100">
            ЭДО <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          Ошибка при сохранении: {error}
        </div>
      )}

      {/* Вкладки */}
      <nav className="flex space-x-6 border-b mb-6">
        {[
          'Основное',
          'Подразделения',
          'Банковские счета',
          'Учетная политика',
          'Лимиты остатка кассы',
          'Регистрации в налоговых органах',
        ].map((tab, i) => (
          <button
            key={tab}
            className={`pb-2 ${
              i === 0
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Форма */}
      <div className="space-y-6">
        {/* Вид / Статус */}
        <div className="grid grid-cols-3 gap-x-8">
          <div className="flex items-center space-x-2">
            <label className="w-24">Вид:</label>
            <select
              value={view}
              onChange={e => setView(e.target.value as any)}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
            >
              <option>Физическое лицо</option>
              <option>Юридическое лицо</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <label className="w-24">Статус:</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
            >
              <option>Индивидуальный предприниматель</option>
              <option>ООО</option>
            </select>
            <Link to="#" className="text-blue-600 hover:underline">
              История
            </Link>
          </div>
        </div>

        {/* ФИО */}
        <div className="grid grid-cols-3 gap-x-8">
          {['Фамилия', 'Имя', 'Отчество'].map((lbl, idx) => {
            const val = [surname, name, patronymic][idx];
            const set = [setSurname, setName, setPatronymic][idx];
            return (
              <div key={lbl}>
                <label className="block">{lbl}:</label>
                <input
                  type="text"
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            );
          })}
        </div>

        {/* Наименование */}
        <div className="flex items-center space-x-2">
          <span className="w-24">Наименование:</span>
          <span className="text-red-600">{fullName}</span>
        </div>

        {/* Префикс */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center">
          <label className="w-24">Префикс:</label>
          <input
            type="text"
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <HelpCircle className="text-gray-400" />
        </div>

        {/* ИНН */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 items-center bg-yellow-50 border border-yellow-300 rounded p-2">
          <label className="w-24">ИНН:</label>
          <input
            type="text"
            value={inn}
            onChange={e => setInn(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <HelpCircle className="text-gray-400" />
          <button
            onClick={handleFill}
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-xs"
          >
            Заполнить реквизиты по ИНН
          </button>
        </div>

        {/* ОГРНИП / Дата регистрации */}
        <div className="grid grid-cols-3 gap-x-8 items-center">
          <div className="flex items-center space-x-2">
            <label className="w-24">ОГРНИП:</label>
            <input
              type="text"
              value={ogrnip}
              onChange={e => setOgrnip(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <HelpCircle className="text-gray-400" />
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <label className="w-24">Дата регистрации:</label>
            <input
              type="date"
              value={registrationDate}
              onChange={e => setRegistrationDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <HelpCircle className="text-gray-400" />
          </div>
        </div>

        {/* Серия и № свидетельства / Дата выдачи */}
        <div className="grid grid-cols-3 gap-x-8 items-center">
          <div className="flex items-center space-x-2">
            <label className="w-24">Серия и № свидетельства:</label>
            <input
              type="text"
              value={certificate}
              onChange={e => setCertificate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <HelpCircle className="text-gray-400" />
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <label className="w-24">Дата выдачи:</label>
            <input
              type="date"
              value={certificateDate}
              onChange={e => setCertificateDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <HelpCircle className="text-gray-400" />
          </div>
        </div>

        {/* Налогообложение */}
        <div className="flex items-center space-x-2">
          <span className="w-24">Налогообложение:</span>
          <Link to="#" className="text-blue-600 hover:underline">
            УСН (доходы)
          </Link>
        </div>

        {/* Основной банковский счет */}
        <details open className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Основной банковский счет</span>
          </summary>
          <div className="mt-2 grid grid-cols-3 gap-x-8">
            <div>
              <label>Банк:</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="БИК или наименование"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div>
              <label>Номер счета:</label>
              <input
                type="text"
                value={bankAccount}
                onChange={e => setBankAccount(e.target.value)}
                placeholder="Номер счета"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1" />
            </div>
          </div>
        </details>

        {/* Адрес и телефон */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Адрес и телефон</span>
          </summary>
          <div className="mt-2 space-y-1">
            <div><span className="font-medium">Адрес:</span> {addressFull}</div>
            <div><span className="font-medium">Дата:</span> {addressDate}</div>
          </div>
        </details>

        {/* Подписи */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Подписи</span>
          </summary>
        </details>

        {/* Логотип и печать */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Логотип и печать</span>
          </summary>
        </details>

        {/* Налоговая инспекция */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Налоговая инспекция</span>
          </summary>
          <div className="mt-2 space-y-1">
            <div><span className="font-medium">Орган:</span> {taxOffice}</div>
            <div><span className="font-medium">Дата учёта:</span> {taxOfficeDate}</div>
          </div>
        </details>

        {/* Социальный фонд */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Социальный фонд</span>
          </summary>
        </details>

        {/* Пенсионный фонд */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Пенсионный фонд</span>
          </summary>
          <div className="mt-2 space-y-1">
            <div><span className="font-medium">Рег. №:</span> {pensionRegNumber}</div>
            <div><span className="font-medium">Дата рег.:</span> {pensionRegDate}</div>
            <div><span className="font-medium">Код:</span> {pensionCode}</div>
          </div>
        </details>

        {/* Фонд соц. страхования */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Фонд соц. страхования</span>
          </summary>
          <div className="mt-2 space-y-1">
            <div><span className="font-medium">Рег. №:</span> {fssRegNumber}</div>
            <div><span className="font-medium">Дата рег.:</span> {fssRegDate}</div>
            <div><span className="font-medium">Код:</span> {fssCode}</div>
          </div>
        </details>

        {/* Коды статистики */}
        <details className="mt-4">
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>Коды статистики: ОКПО {okpo}, ОКТМО {oktmo}, ОКФС {okfs}, ОКОГУ {okogu}</span>
          </summary>
        </details>
      </div>
    </div>
  );
}
