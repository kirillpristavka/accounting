// src/pages/BalanceEntryPage.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Star, ChevronDown, X, Trash2
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

interface Organization {
  id: number
  name: string
}

interface BalanceDocument {
  id: number
  date: string
  number: string
  organization: { name: string }
  comment?: string
}

const sections = [
  'Основные средства',
  'НМА и НИОКР',
  'Капитальные вложения',
  'Материалы',
  'НДС',
  'Незавершенное производство',
  'Товары',
  'Готовая продукция',
  'Товары отгруженные',
  'Денежные средства',
  'Расчеты с поставщиками',
  'Расчеты с покупателями',
  'Расчеты по налогам и взносам',
  'Расчеты с персоналом по оплате труда',
  'Расчеты с подотчетными лицами',
  'Расчеты с учредителями',
  'Расчеты с разными дебиторами и кредиторами',
  'НДС по авансам',
  'Капитал',
  'Расходы будущих периодов',
  'Отложенные налоговые активы/обязательства',
  'Прочие счета бухгалтерского учета',
  'НДС по реализации',
  'Прочие расходы налогового учета УСН и ИП',
  'Спецоснастка и эксплуатации',
  'Аренда и лизинг',
]

const BalanceEntryPage: React.FC = () => {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('')
  const [documents, setDocuments] = useState<BalanceDocument[]>([])
  const [loading, setLoading] = useState(false)

  const { accountCode } = useParams<{ accountCode: string }>()

  const [selectedSection, setSelectedSection] = useState(sections[6]) // Товары
  const [useOrgFilter, setUseOrgFilter] = useState(true)
  const [useSectionFilter, setUseSectionFilter] = useState(true)

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  // Загрузка организаций
  useEffect(() => {
    axios.get('/api/organizations')
      .then(res => {
        setOrganizations(res.data)
        if (res.data.length > 0) {
          setSelectedOrgId(res.data[0].id)
        }
      })
      .catch(console.error)
  }, [])

  // Загрузка документов
  useEffect(() => {
    if (!accountCode) return
    axios
      .get(`/api/goods-balance/by-account/${accountCode}`)
      .then((res) => setDocuments(res.data))
      //.catch(() => setError('Ошибка при загрузке документов'))
      .finally(() => setLoading(false))
  }, [accountCode])

  const { closeTab } = useAppContext()

  const handleClose = () => {
    closeTab(location.pathname)
    navigate(-1)
  }

  const handleDelete = async () => {
    if (selectedRowIndex === null) return
    const doc = documents[selectedRowIndex]
    if (!doc?.id) return

    if (!confirm(`Удалить документ №${doc.number}?`)) return

    try {
      await axios.delete(`/api/goods-balance/${doc.id}`)
      setDocuments(prev => prev.filter((_, i) => i !== selectedRowIndex))
      setSelectedRowIndex(null)
    } catch (err) {
      console.error('Ошибка при удалении документа', err)
      alert('Ошибка при удалении документа')
    }
  }


  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => navigate(+1)} className="p-2 bg-white border rounded">
            <ChevronRight size={16} />
          </button>
          <button className="p-2 bg-white border rounded">
            <Star size={16} />
          </button>
          <h1 className="text-xl font-semibold ml-2">Ввод остатков</h1>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Закрыть"
        >
          <X size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-6 items-center mb-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={useOrgFilter} onChange={() => setUseOrgFilter(v => !v)} />
          <span className="text-sm font-medium">Организация:</span>
          <select
            className="border px-2 py-1 rounded"
            value={selectedOrgId}
            onChange={e => setSelectedOrgId(Number(e.target.value))}
            disabled={!useOrgFilter}
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={useSectionFilter} onChange={() => setUseSectionFilter(v => !v)} />
          <span className="text-sm font-medium">Раздел учета:</span>
          <select
            className="border px-2 py-1 rounded"
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            disabled={!useSectionFilter}
          >
            {sections.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
            onClick={() => navigate('/goods-balance-entry')}
          >
            Создать
          </button>
          <button
            className="px-2 py-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
            onClick={handleDelete}
            disabled={selectedRowIndex === null}
          >
            <Trash2 className={selectedRowIndex !== null ? "text-red-500" : ""} size={16} />
          </button>
          <button className="px-2 bg-white border rounded hover:bg-gray-100">
            <div className="text-xs text-green-500 -ml-2">Дт</div>
            <div className="text-xs text-red-500 ml-2">Кт</div>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Поиск"
            className="px-2 py-1 border rounded"
          />
          <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Еще <ChevronDown size={16} className="inline ml-1" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Дата</th>
              <th className="p-2 text-left">Номер</th>
              <th className="p-2 text-left">БУ</th>
              <th className="p-2 text-left">НУ</th>
              <th className="p-2 text-left">СР</th>
              <th className="p-2 text-left">Раздел учета</th>
              <th className="p-2 text-left">Организация</th>
              <th className="p-2 text-left">Ответственный</th>
              <th className="p-2 text-left">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr
                key={doc.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedRowIndex === idx ? 'bg-yellow-100' : ''
                }`}
                onClick={() => setSelectedRowIndex(idx)}
                onDoubleClick={() => navigate(`/goods-balance/${doc.id}`)}
              >
                <td className="p-2">{new Date(doc.date).toLocaleDateString()}</td>
                <td className="p-2">{doc.number}</td>
                <td className="p-2 text-green-600">✓</td>
                <td className="p-2 text-green-600">✓</td>
                <td className="p-2 text-green-600">✓</td>
                <td className="p-2">Товары</td>
                <td className="p-2">{doc.organization.name}</td>
                <td className="p-2">&lt;Не указан&gt;</td>
                <td className="p-2">{doc.comment || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75">
          <span className="text-gray-500">Загрузка...</span>
        </div>
      )}
    </div>
  )
}

export default BalanceEntryPage