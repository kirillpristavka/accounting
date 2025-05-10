// src/pages/OrganizationEditPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

export default function OrganizationEditPage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // стейты открытия секций
  const [bankOpen, setBankOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [signaturesOpen, setSignaturesOpen] = useState(false);
  const [logoOpen, setLogoOpen] = useState(false);
  const [taxOpen, setTaxOpen] = useState(false);
  const [pensionOpen, setPensionOpen] = useState(false);
  const [fssOpen, setFssOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  // Основные поля
  const [view, setView] = useState<'Физическое лицо' | 'Юридическое лицо'>('Физическое лицо');
  const [status, setStatus] = useState<'Индивидуальный предприниматель' | 'ООО'>('Индивидуальный предприниматель');
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [fullName, setFullName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [inn, setInn] = useState('');
  const [ogrnip, setOgrnip] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [certificate, setCertificate] = useState('');
  const [certificateDate, setCertificateDate] = useState('');

  // — Авто‑сборка полного имени из ФИО —
  useEffect(() => {
    setFullName(
      [surname, name, patronymic]
        .filter(part => part.trim() !== '')
        .join(' ')
    );
  }, [surname, name, patronymic]);

  // Секции реквизитов
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

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных
  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch(`/api/organizations/${id}`);
        if (!res.ok) throw new Error(res.statusText);
        const data: any = await res.json();
        setView(data.view);
        setStatus(data.status);
        setSurname(data.surname);
        setName(data.name);
        setPatronymic(data.patronymic);
        setFullName(data.fullName);
        setPrefix(data.prefix);
        setInn(data.inn);
        setOgrnip(data.ogrnip);
        setRegistrationDate(data.registrationDate);
        setCertificate(data.certificate);
        setCertificateDate(data.certificateDate);
        setBankName(data.bank.name);
        setBankAccount(data.bank.account);
        setAddressFull(data.address.full);
        setAddressDate(data.address.date);
        setTaxOffice(data.taxInspection.office);
        setTaxOfficeDate(data.taxInspection.date);
        setPensionRegNumber(data.pension.regNumber);
        setPensionRegDate(data.pension.date);
        setPensionCode(data.pension.code);
        setFssRegNumber(data.fss.regNumber);
        setFssRegDate(data.fss.date);
        setFssCode(data.fss.code);
        setOkpo(data.statistics.okpo);
        setOktmo(data.statistics.oktmo);
        setOkfs(data.statistics.okfs);
        setOkogu(data.statistics.okogu);
      } catch (e: any) {
        console.error(e);
        setError('Не удалось загрузить организацию');
      }
    }
    if (id) fetchOrg();
  }, [id]);

  // Заполнить по ИНН
  const handleFill = async () => {
    if (!inn) return;
    try {
      const params = new URLSearchParams({ req: inn, key: '3d38845db210b09ee3c47847810088e9775edb38' });
      const res = await fetch(`https://api-fns.ru/api/egr?${params}`);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      if (json.items?.length) {
        const rec = json.items[0].ИП;
        const fio = rec.ФИОПолн.split(' ');
        setSurname(fio[0] || '');
        setName(fio[1] || '');
        setPatronymic(fio[2] || '');
        setFullName(rec.ФИОПолн);
        setOgrnip(rec.ОГРНИП);
        setRegistrationDate(rec.ДатаРег);
        setCertificate(rec.СвидетРег || '');
        setCertificateDate(rec.СвидетДата || '');
        setAddressFull(rec.Адрес.АдресПолн);
        setAddressDate(rec.Адрес.Дата);
        setTaxOffice(rec.НО.Рег);
        setTaxOfficeDate(rec.НО.РегДата);
        setPensionRegNumber(rec.ПФ.РегНомПФ);
        setPensionRegDate(rec.ПФ.ДатаРегПФ);
        setPensionCode(rec.ПФ.КодПФ);
        setFssRegNumber(rec.ФСС.РегНомФСС);
        setFssRegDate(rec.ФСС.ДатаРегФСС);
        setFssCode(rec.ФСС.КодФСС);
        setOkpo(rec.КодыСтат.ОКПО);
        setOktmo(rec.КодыСтат.ОКТМО);
        setOkfs(rec.КодыСтат.ОКФС);
        setOkogu(rec.КодыСтат.ОКОГУ);
      }
    } catch (e) {
      console.error('Ошибка получения реквизитов:', e);
    }
  };

  // Сохранение
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
      const res = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      navigate('/organizations');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ошибка при сохранении');
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
          <h1 className="text-xl font-semibold">Организация (редактирование)</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveAndClose}
            disabled={isSaving}
            className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 disabled:opacity-50"
          >
            {isSaving ? 'Сохраняем…' : 'Записать и закрыть'}
          </button>
          <Link to="/organizations" className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
            Отмена
          </Link>
        </div>
      </div>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">Ошибка: {error}</div>}
      <nav className="flex space-x-6 border-b mb-6">
        {['Основное','Подразделения','Банковские счета','Учетная политика','Лимиты остатка кассы','Регистрации в налоговых органах'].map((tab,i)=>(
          <button key={tab} className={`pb-2 ${i===0?'border-b-2 border-green-600 text-green-600':'text-gray-600 hover:text-green-600'}`}>{tab}</button>
        ))}
      </nav>
      <div className="space-y-6">
        {/* Вид / Статус */}
        <div className="grid grid-cols-3 gap-x-8">
          <div className="flex items-center space-x-2">
            <label className="w-24">Вид:</label>
            <select value={view} onChange={e=>setView(e.target.value as any)} className="flex-1 border border-gray-300 rounded px-2 py-1">
              <option>Физическое лицо</option>
              <option>Юридическое лицо</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <label className="w-24">Статус:</label>
            <select value={status} onChange={e=>setStatus(e.target.value as any)} className="flex-1 border border-gray-300 rounded px-2 py-1">
              <option>Индивидуальный предприниматель</option>
              <option>ООО</option>
            </select>
            <Link to="#" className="text-blue-600 hover:underline">История</Link>
          </div>
        </div>
        {/* ФИО */}
        <div className="grid grid-cols-3 gap-x-8">
          {['Фамилия','Имя','Отчество'].map((lbl,idx)=>{
            const vals=[surname,name,patronymic];const sets=[setSurname,setName,setPatronymic];
            return(
              <div key={lbl}>
                <label className="block">{lbl}:</label>
                <input type="text" value={vals[idx]} onChange={e=>sets[idx](e.target.value)} className="mt-1 w-full border border-gray-300 rounded px-2 py-1"/>
              </div>
            )
          })}
        </div>
        {/* Наименование и Префикс */}
        <div className="flex items-center space-x-2">
          <span className="w-24">Наименование:</span>
          <span className="text-red-600">{fullName}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center">
          <label className="w-24">Префикс:</label>
          <input type="text" value={prefix} onChange={e=>setPrefix(e.target.value)} className="border border-gray-300 rounded px-2 py-1"/>
          <HelpCircle className="text-gray-400"/>
        </div>
        {/* ИНН */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 items-center bg-yellow-50_BORDER border-yellow-300 rounded p-2">
          <label className="w-24">ИНН:</label>
          <input type="text" value={inn} onChange={e=>setInn(e.target.value)} className="border border-gray-300 rounded px-2 py-1"/>
          <HelpCircle className="text-gray-400"/>
          <button onClick={handleFill} className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-xs">Заполнить реквизиты по ИНН</button>
        </div>
        {/* ОГРНИП и дата регистрации */}
        <div className="grid grid-cols-3 gap-x-8 items-center">
          <div className="flex items-center space-x-2">
            <label className="w-24">ОГРНИП:</label>
            <input type="text" value={ogrnip} onChange={e=>setOgrnip(e.target.value)} className="border border-gray-300 rounded px-2 py-1"/>
            <HelpCircle className="text-gray-400"/>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <label className="w-24">Дата регистрации:</label>
            <input type="date" value={registrationDate} onChange={e=>setRegistrationDate(e.target.value)} className="border border-gray-300 rounded px-2 py-1"/>
            <HelpCircle className="text-gray-400"/>
          </div>
        </div>
        {/* Свидетельство */}
        <div className="grid grid-cols-3 gap-x-8 items-center">
          <div className="flex items-center space-x-2">
            <label className="w-24">Свид-во №:</label>
            <input type="text" value={certificate} onChange={e=>setCertificate(e.target.value)} className="border border-gray-300 rounded px-2 py-1"/>
            <HelpCircle className="text-gray-400"/>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <label className="w-24">Дата выдачи:</label>
            <input type="date" value={certificateDate} onChange={e=>setCertificateDate(e.target.value)} className="border border-gray-300 rounded px-2 py-1"/>
            <HelpCircle className="text-gray-400"/>
          </div>
        </div>
        {/* Основной банковский счет */}
        <details
          className="mt-4"
          open={bankOpen}
          onToggle={e => setBankOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                bankOpen ? 'rotate-90' : ''
              }`}
            />
            <span>
              { !bankOpen
                ? `Банк: ${bankName || '—'} | Счет: ${bankAccount || '—'}`
                : 'Основной банковский счет'
              }
            </span>
          </summary>
          {bankOpen && (
            <div className="mt-2 grid grid-cols-3 gap-x-8">
              <div>
                <label>Банк:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="БИК или название"
                  className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div>
                <label>Счет:</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="Номер счета"
                  className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            </div>
          )}
        </details>

        {/* Адрес и телефон */}
        <details
          className="mt-4"
          open={addressOpen}
          onToggle={e => setAddressOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                addressOpen ? 'rotate-90' : ''
              }`}
            />
            <span>
              { !addressOpen
                ? `Адрес: ${addressFull || '—'}`
                : 'Адрес и телефон'
              }
            </span>
          </summary>
          {addressOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium">Адрес:</label>
                <input
                  type="text"
                  value={addressFull}
                  onChange={e => setAddressFull(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium">Дата:</label>
                <input
                  type="date"
                  value={addressDate}
                  onChange={e => setAddressDate(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
            </div>
          )}
        </details>

        {/* Подписи */}
        <details
          className="mt-4"
          open={signaturesOpen}
          onToggle={e => setSignaturesOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                signaturesOpen ? 'rotate-90' : ''
              }`}
            />
            <span>Подписи</span>
          </summary>
          {signaturesOpen && (
            <div className="mt-2">
              {/* вставьте здесь ваши поля для подписей */}
              <div>— поля для загрузки/обозначения подписей —</div>
            </div>
          )}
        </details>

        {/* Логотип и печать */}
        <details
          className="mt-4"
          open={logoOpen}
          onToggle={e => setLogoOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                logoOpen ? 'rotate-90' : ''
              }`}
            />
            <span>Логотип и печать</span>
          </summary>
          {logoOpen && (
            <div className="mt-2">
              {/* вставьте здесь поля для загрузки логотипа и печати */}
              <div>— поля для загрузки логотипа/печати —</div>
            </div>
          )}
        </details>

        {/* Налоговая инспекция */}
        <details
          className="mt-4"
          open={taxOpen}
          onToggle={e => setTaxOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                taxOpen ? 'rotate-90' : ''
              }`}
            />
            <span>
              { !taxOpen
                ? `Инспекция: ${taxOffice || '—'}`
                : 'Налоговая инспекция'
              }
            </span>
          </summary>
          {taxOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium">Орган:</label>
                <input
                  type="text"
                  value={taxOffice}
                  onChange={e => setTaxOffice(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-24 font-medium">Дата учета:</label>
                <input
                  type="date"
                  value={taxOfficeDate}
                  onChange={e => setTaxOfficeDate(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
            </div>
          )}
        </details>

        {/* Социальные фонды */}
        <details
          className="mt-4"
          open={pensionOpen}
          onToggle={e => setPensionOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                pensionOpen ? 'rotate-90' : ''
              }`}
            />
            <span>
              { !pensionOpen
                ? `ПФР: ${pensionRegNumber || '—'}`
                : 'Пенсионный фонд'
              }
            </span>
          </summary>
          {pensionOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Рег. №:</label>
                <input
                  type="text"
                  value={pensionRegNumber}
                  onChange={e => setPensionRegNumber(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Дата рег.:</label>
                <input
                  type="date"
                  value={pensionRegDate}
                  onChange={e => setPensionRegDate(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Код:</label>
                <input
                  type="text"
                  value={pensionCode}
                  onChange={e => setPensionCode(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
            </div>
          )}
        </details>

        <details
          className="mt-4"
          open={fssOpen}
          onToggle={e => setFssOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                fssOpen ? 'rotate-90' : ''
              }`}
            />
            <span>
              { !fssOpen
                ? `ФСС: ${fssRegNumber || '—'}`
                : 'Фонд соц. страхования'
              }
            </span>
          </summary>
          {fssOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Рег. №:</label>
                <input
                  type="text"
                  value={fssRegNumber}
                  onChange={e => setFssRegNumber(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Дата рег.:</label>
                <input
                  type="date"
                  value={fssRegDate}
                  onChange={e => setFssRegDate(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Код:</label>
                <input
                  type="text"
                  value={fssCode}
                  onChange={e => setFssCode(e.target.value)}
                  className="flex-1 border rounded p-1"
                />
              </div>
            </div>
          )}
        </details>

        {/* Коды статистики */}
        <details
          className="mt-4 mb-8"
          open={statsOpen}
          onToggle={e => setStatsOpen(e.currentTarget.open)}
        >
          <summary className="flex items-center space-x-2 text-green-600 cursor-pointer">
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                statsOpen ? 'rotate-90' : ''
              }`}
            />
            <span>
              { !statsOpen
                ? `ОКПО: ${okpo || '—'}`
                : 'Коды статистики'
              }
            </span>
          </summary>
          {statsOpen && (
            <div className="mt-2 space-y-2">
              <div><strong>ОКПО:</strong> {okpo}</div>
              <div><strong>ОКТМО:</strong> {oktmo}</div>
              <div><strong>ОКФС:</strong> {okfs}</div>
              <div><strong>ОКОГУ:</strong> {okogu}</div>
            </div>
          )}
        </details>
      </div>
    </div>
  );
}