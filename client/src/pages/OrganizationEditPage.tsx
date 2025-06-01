// src/pages/OrganizationEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

axios.defaults.baseURL = 'http://localhost:4000';

// Названия вкладок совпадают с OrganizationCreatePage
const tabLabels = [
  'Основное',
  'Подразделения',
  'Банковские счета',
  'Учётная политика',
  'Лимиты остатка кассы',
  'Регистрации в налоговых органах',
];

interface OrganizationItem {
  id: number;
  type: 'PHYSICAL' | 'LEGAL';
  physicalType?: 'SELF_EMPLOYED' | 'IP';
  lastName: string;
  firstName: string;
  middleName: string;
  name: string;
  prefix: string;
  inn: string;
  taxation: string;
}

const OrganizationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Поля формы
  const [type, setType] = useState<'Физическое лицо' | 'Юридическое лицо'>('Физическое лицо');
  const [status, setStatus] = useState<'Самозанятый' | 'ИП'>('Самозанятый');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [inn, setInn] = useState('');
  const [taxation, setTaxation] = useState('');
  const [showPrefixTip, setShowPrefixTip] = useState(false);
  const [showInnTip, setShowInnTip] = useState(false);

  // Собираем полное ФИО «на лету»
  const fullName = [lastName, firstName, middleName].filter(Boolean).join(' ');

  useEffect(() => {
    if (!id) return;
    axios
      .get<OrganizationItem>(`/api/organizations/${id}`)
      .then((res) => {
        const d = res.data;
        // Переводим type/physicalType в русские строки
        if (d.type === 'PHYSICAL') {
          setType('Физическое лицо');
          setStatus(d.physicalType === 'SELF_EMPLOYED' ? 'Самозанятый' : 'ИП');
        } else {
          setType('Юридическое лицо');
        }
        setLastName(d.lastName || '');
        setFirstName(d.firstName || '');
        setMiddleName(d.middleName || '');
        setPrefix(d.prefix || '');
        setInn(d.inn || '');
        setTaxation(d.taxation || '');
      })
      .catch(() => {
        setError('Не удалось загрузить данные организации');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveAndClose = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await axios.put(`/api/organizations/${id}`, {
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
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении организации');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Загрузка…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 flex-1 overflow-auto">
      {/* Навигация и заголовок */}
      <div className="flex justify-between items-center mb-4">
        {/* Левая часть: «назад», «вперёд», «звёздочка», заголовок */}
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 bg-white border rounded">
            <ChevronRight size={16} />
          </button>
          <button className="p-2 bg-white border rounded">
            <Star size={16} />
          </button>
          <h1 className="text-xl font-semibold ml-2">Редактировать организацию</h1>
        </div>

        {/* Правая часть: кнопка «Закрыть» (иконка X) */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Закрыть"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Табы (точно те же классы, что и в Create) */}
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

      {/* Тулбар (только для «Основное») */}
      {activeTab === 0 && (
        <div className="flex items-center mb-6 space-x-2">
          <button
            onClick={handleSaveAndClose}
            className="px-3 py-1 bg-yellow-400 text-black font-medium rounded shadow-sm hover:bg-yellow-500"
            disabled={saving}
          >
            Записать и закрыть
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-3 py-1 bg-white border rounded flex items-center hover:bg-gray-100"
            disabled={saving}
          >
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
            ЭДО <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* Контент вкладок (точно дублируем из Create) */}
      <div className="bg-white border rounded p-4 space-y-6">
        {/* === Вкладка «Основное» === */}
        {activeTab === 0 && (
          <>
            {/* Вид и Статус */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Вид:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as 'Физическое лицо' | 'Юридическое лицо')
                  }
                >
                  <option>Физическое лицо</option>
                  <option>Юридическое лицо</option>
                </select>
              </div>
              {type === 'Физическое лицо' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Статус:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as 'Самозанятый' | 'ИП')
                    }
                  >
                    <option>Самозанятый</option>
                    <option>ИП</option>
                  </select>
                </div>
              )}
            </div>

            {/* ФИО */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Фамилия', value: lastName, onChange: setLastName },
                { label: 'Имя', value: firstName, onChange: setFirstName },
                { label: 'Отчество', value: middleName, onChange: setMiddleName },
              ].map((fld, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{fld.label}:</label>
                  <input
                    type="text"
                    className="w-full border px-2 py-1 rounded"
                    placeholder={fld.label}
                    value={fld.value}
                    onChange={(e) => fld.onChange(e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Автоподставляемое наименование */}
            <div>
              <label className="block text-sm font-medium mb-1">Наименование:</label>
              <div className={`text-sm ${fullName ? 'text-gray-800' : 'text-red-600'}`}>
                {fullName || '<Не заполнено ФИО>'}
              </div>
            </div>

            {/* Префикс */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Префикс:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
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
                <div className="absolute top-full left-0 mt-2 w-80 bg-yellow-100 border border-gray-300 p-3 text-sm rounded shadow-lg z-10">
                  Префикс включается в состав номера документа…
                </div>
              )}
            </div>

            {/* ИНН */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">ИНН:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  placeholder="ИНН"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
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
                <div className="absolute top-full left-0 mt-2 w-96 bg-yellow-100 border border-gray-300 p-3 text-sm rounded shadow-lg z-10">
                  Идентификационный номер налогоплательщика (ИНН)…
                </div>
              )}
            </div>

            {/* Налогообложение */}
            <div>
              <label className="block text-sm font-medium mb-1">Налогообложение:</label>
              <select
                className="w-full border px-2 py-1 rounded"
                value={taxation}
                onChange={(e) => setTaxation(e.target.value)}
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

            {/* Коллапс-секции */}
            <details className="pt-2">
              <summary className="text-green-600 cursor-pointer">
                Основной банковский счет
              </summary>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Банк:</label>
                  <input
                    type="text"
                    className="w-full border px-2 py-1 rounded"
                    placeholder="БИК или наименование"
                  />
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
            {['Адрес и телефон', 'Логотип и печать', 'Налоговая инспекция'].map((section, i) => (
              <details key={i} className="pt-2">
                <summary className="text-green-600 cursor-pointer">{section}</summary>
                <div className="mt-2 text-gray-600">
                  {/* Содержимое раздела {section} */}
                </div>
              </details>
            ))}
          </>
        )}

        {/* === Вкладка «Подразделения» === */}
        {activeTab === 1 && (
          <div className="text-gray-600">Раздел «Подразделения»</div>
        )}

        {/* === Вкладка «Банковские счета» === */}
        {activeTab === 2 && (
          <div className="text-gray-600">Раздел «Банковские счета»</div>
        )}

        {/* === Вкладка «Учётная политика» === */}
        {activeTab === 3 && (
          <div className="text-gray-600">Раздел «Учётная политика»</div>
        )}

        {/* === Вкладка «Лимиты остатка кассы» === */}
        {activeTab === 4 && (
          <div className="text-gray-600">Раздел «Лимиты остатка кассы»</div>
        )}

        {/* === Вкладка «Регистрации в налоговых органах» === */}
        {activeTab === 5 && (
          <div className="text-gray-600">Раздел «Регистрации в налоговых органах»</div>
        )}
      </div>
    </div>
  );
};

export default OrganizationEditPage;