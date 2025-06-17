// src/pages/BalanceEntryPage.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Star, ChevronDown, Info, X,
} from 'lucide-react'

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

const BalanceEntryPage: React.FC = () => {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('')
  const [documents, setDocuments] = useState<BalanceDocument[]>([])
  const [loading, setLoading] = useState(false)

  const { accountCode } = useParams<{ accountCode: string }>()

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
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <X size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center mb-4 gap-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Организация:</span>
          <select
            className="border px-2 py-1 rounded"
            value={selectedOrgId}
            onChange={e => setSelectedOrgId(Number(e.target.value))}
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Раздел учета:</span>
          <input type="checkbox" checked readOnly />
          <span>Товары</span>
        </div>
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
                className="hover:bg-gray-50 cursor-pointer"
                onDoubleClick={() => navigate(`/goods-balance-entry/${doc.id}`)}
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