// src/pages/OrganizationEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import { useOrganizationEdit } from '../stores/useOrganizationEdit';
import type { Taxation } from '../stores/useOrganizationEdit';
import { useAppContext } from '../context/AppContext';

axios.defaults.baseURL = 'http://localhost:4000';

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
  const orgId = id ?? '';
  const navigate = useNavigate();
  const location = useLocation();
  const { closeTab } = useAppContext();

  const [pageTitle, setPageTitle] = useState('Редактировать организацию');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Берём весь store-API
  const {
    data,
    initForm,
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
  } = useOrganizationEdit();

  // Если формы для данного orgId ещё нет, будем использовать дефолт
  const single = data[orgId] ?? {
    type: 'Физическое лицо',
    status: 'Самозанятый',
    lastName: '',
    firstName: '',
    middleName: '',
    prefix: '',
    inn: '',
    taxation: 'Налог на профессиональный доход ("самозанятые")',
    showPrefixTip: false,
    showInnTip: false,
  };

  // Собираем «Фамилия И.О.»
  const fullName = single.lastName
    ? `${single.lastName.trim()} ${
        single.firstName ? single.firstName.trim()[0].toUpperCase() + '.' : ''
      }${single.middleName ? single.middleName.trim()[0].toUpperCase() + '.' : ''}`
    : '';

  // useEffect: только при изменении orgId (или при инициализации initForm),
  // но НЕ при каждом переключении activeTab
  useEffect(() => {
    if (!orgId) return;
    // Если мы уже инициализировали data[orgId], не нужно делать это снова:
    if (data[orgId]) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get<OrganizationItem>(`/api/organizations/${orgId}`)
      .then((res) => {
        const d = res.data;
        const orgType = d.type === 'PHYSICAL' ? 'Физическое лицо' : 'Юридическое лицо';
        const physStatus: 'Самозанятый' | 'ИП' =
          d.type === 'PHYSICAL'
            ? d.physicalType === 'SELF_EMPLOYED'
              ? 'Самозанятый'
              : 'ИП'
            : 'ИП';

        // Приводим taxation из API к одному из литералов Taxation
        const tax: Taxation = (d.taxation as Taxation) ?? 'Налог на профессиональный доход ("самозанятые")';

        // Собираем initialState — именно те поля, которые есть в SingleOrgState
        const initialState: Partial<typeof single> = {
          type: orgType,
          status: physStatus,
          lastName: d.lastName || '',
          firstName: d.firstName || '',
          middleName: d.middleName || '',
          prefix: d.prefix || '',
          inn: d.inn || '',
          taxation: tax,
          showPrefixTip: false,
          showInnTip: false,
        };

        initForm(orgId, initialState);

        // Сразу формируем заголовок точно так же, как в Topbar
        if (d.lastName) {
          const fio = `${d.lastName.trim()} ${
            d.firstName ? d.firstName.trim()[0].toUpperCase() + '.' : ''
          }${d.middleName ? d.middleName.trim()[0].toUpperCase() + '.' : ''}`;
          setPageTitle(`${fio} (Организация)`);
        } else {
          setPageTitle(`Организация #${d.id}`);
        }
      })
      .catch(() => {
        setError('Не удалось загрузить данные организации');
      })
      .finally(() => setLoading(false));
  }, [orgId, data, initForm]);  
  // Важно: зависимости — только orgId, data и сама initForm. activeTab тут не участвует.

  // Сохраняем и закрываем
  const handleSaveAndClose = async () => {
    if (!orgId) return;
    setSaving(true);
    try {
      await axios.put(`/api/organizations/${orgId}`, {
        type: single.type === 'Физическое лицо' ? 'PHYSICAL' : 'LEGAL',
        ...(single.type === 'Физическое лицо' && {
          physicalType: single.status === 'Самозанятый' ? 'SELF_EMPLOYED' : 'IP',
        }),
        lastName: single.lastName,
        firstName: single.firstName,
        middleName: single.middleName,
        name: fullName,
        prefix: single.prefix,
        inn: single.inn,
        taxation: single.taxation,
      });
      resetForm(orgId);
      closeTab(location.pathname);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении организации');
    } finally {
      setSaving(false);
    }
  };

  // «Назад» — просто уходим, без сброса стора
  const handleBack = () => {
    navigate(-1);
  };

  // «Закрыть» — сбрасываем только data[orgId], закрываем вкладку, уходим назад
  const handleClose = () => {
    resetForm(orgId);
    closeTab(location.pathname);
    navigate(-1);
  };

  if (loading) return <div className="p-4">Загрузка…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 flex-1 overflow-auto">
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
          <h1 className="text-xl font-semibold ml-2">{pageTitle}</h1>
        </div>
        <div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Закрыть"
          >
            <X size={16} />
          </button>
        </div>
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

      {/* Тулбар (для «Основное») */}
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

      {/* Контент вкладок */}
      <div className="bg-white border rounded p-4 space-y-6">
        {activeTab === 0 && (
          <>
            {/* Вид и Статус */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Вид:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={single.type}
                  onChange={(e) => setType(orgId, e.target.value as any)}
                >
                  <option>Физическое лицо</option>
                  <option>Юридическое лицо</option>
                </select>
              </div>
              {single.type === 'Физическое лицо' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Статус:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={single.status}
                    onChange={(e) => setStatus(orgId, e.target.value as any)}
                  >
                    <option>Самозанятый</option>
                    <option>ИП</option>
                  </select>
                </div>
              )}
            </div>

            {/* Поля ФИО */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Фамилия', value: single.lastName, onChange: setLastName },
                { label: 'Имя', value: single.firstName, onChange: setFirstName },
                { label: 'Отчество', value: single.middleName, onChange: setMiddleName },
              ].map((fld, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{fld.label}:</label>
                  <input
                    type="text"
                    className="w-full border px-2 py-1 rounded"
                    placeholder={fld.label}
                    value={fld.value}
                    onChange={(e) => fld.onChange(orgId, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Автоподставляемое «Наименование» */}
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
                  value={single.prefix}
                  onChange={(e) => setPrefix(orgId, e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowPrefixTip(orgId, !single.showPrefixTip)}
                >
                  ?
                </button>
              </div>
              {single.showPrefixTip && (
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
                  value={single.inn}
                  onChange={(e) => setInn(orgId, e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowInnTip(orgId, !single.showInnTip)}
                >
                  ?
                </button>
              </div>
              {single.showInnTip && (
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
                value={single.taxation}
                onChange={(e) => setTaxation(orgId, e.target.value as any)}
              >
                {single.status === 'Самозанятый' ? (
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

            {/* Дополнительные коллапс-секции */}
            <details className="pt-2">
              <summary className="text-green-600 cursor-pointer">Основной банковский счет</summary>
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
                  {/* Тут будет содержимое раздела {section} */}
                </div>
              </details>
            ))}
          </>
        )}

        {activeTab === 1 && <div className="text-gray-600">Раздел «Подразделения»</div>}
        {activeTab === 2 && <div className="text-gray-600">Раздел «Банковские счета»</div>}
        {activeTab === 3 && <div className="text-gray-600">Раздел «Учётная политика»</div>}
        {activeTab === 4 && <div className="text-gray-600">Раздел «Лимиты остатка кассы»</div>}
        {activeTab === 5 && <div className="text-gray-600">Раздел «Регистрации в налоговых органах»</div>}
      </div>
    </div>
  );
};

export default OrganizationEditPage;