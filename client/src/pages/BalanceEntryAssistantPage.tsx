// src/pages/BalanceEntryAssistantPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, ChevronDown, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

interface Organization {
  id: number
  name: string
}

interface AccountSummary {
  account: string
  name: string
}

interface AccountBalance extends AccountSummary {
  balanceDr: number
  balanceCr: number
}

const tabLabels = [
  'Основные счета плана счетов',
  'Забалансовые счета плана счетов'
]

const BalanceEntryAssistantPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { closeTab } = useAppContext()

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('')
  const [entryDate, setEntryDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  )
  const [activeTab, setActiveTab] = useState(0)
  const [accounts, setAccounts] = useState<AccountBalance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Получаем список организаций
  useEffect(() => {
    axios.get<Organization[]>('/api/organizations')
      .then(res => {
        setOrganizations(res.data)
        if (res.data[0]) setSelectedOrgId(res.data[0].id)
      })
      .catch(console.error)
  }, [])

  // Получаем список счетов при смене вкладки (offBalance = true для забалансовых)
  useEffect(() => {
    setLoading(true)
    axios.get<AccountSummary[]>('/api/accounts', {
      params: { offBalance: activeTab === 1 }
    })
      .then(res => {
        setAccounts(
          res.data.map(a => ({
            account: a.account,
            name: a.name,
            balanceDr: 0,
            balanceCr: 0
          }))
        )
        setError(null)
      })
      .catch(() => setError('Ошибка при загрузке данных'))
      .finally(() => setLoading(false))
  }, [activeTab])

  const totalDr = accounts.reduce((sum, a) => sum + a.balanceDr, 0)
  const totalCr = accounts.reduce((sum, a) => sum + a.balanceCr, 0)

  const handleClose = () => {
    closeTab(location.pathname)
    navigate(-1)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      {/* Хедер */}
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
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
          <h1 className="text-xl font-semibold ml-2">
            Помощник ввода начальных остатков
          </h1>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Закрыть"
        >
          <X size={16} />
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex-shrink-0 mb-4 space-y-4">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Организация:</span>
            <select
              className="border px-2 py-1 rounded"
              value={selectedOrgId}
              onChange={e => setSelectedOrgId(Number(e.target.value))}
            >
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Дата ввода остатков:</label>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={entryDate}
              onChange={e => setEntryDate(e.target.value)}
            />
          </div>
        </div>

        {/* Вкладки */}
        <nav className="flex-shrink-0 flex space-x-4 border-b border-gray-200 overflow-x-auto">
          {tabLabels.map((lbl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`pb-2 text-sm ${
                activeTab === idx
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {lbl}
            </button>
          ))}
        </nav>

        {/* Действия */}
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={() => navigate('/goods-balance')}
            className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
          >
            Ввести остатки по счету
          </button>
          <button className="flex items-center px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Еще <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Таблица с прокруткой */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto min-h-0">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Счет</th>
                <th className="p-2 text-left">Наименование</th>
                <th className="p-2 text-left">Сальдо Дт</th>
                <th className="p-2 text-left">Сальдо Кт</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr
                  key={acc.account}
                  onDoubleClick={() => navigate(`/balance-entry/${acc.account}`)}
                  className="hover:bg-gray-50 even:bg-gray-50 cursor-pointer"
                >
                  <td className="p-2">{acc.account}</td>
                  <td className="p-2">{acc.name}</td>
                  <td className="p-2">{acc.balanceDr || '-'}</td>
                  <td className="p-2">{acc.balanceCr || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="sticky bottom-0 bg-gray-100 font-medium">
                {activeTab === 0 ? (
                  <td colSpan={2} className="p-2">Итого (баланс):</td>
                ) : (
                  <td colSpan={2} className="p-2">Итого (по забалансовым счетам):</td>
                )}
                <td className="p-2">{totalDr !== 0 ? totalDr : '-'}</td>
                <td className="p-2">{totalCr !== 0 ? totalCr : '-'}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <span className="text-gray-500">Загрузка...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <span className="text-red-500">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BalanceEntryAssistantPage