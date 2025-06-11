// src/pages/GoodsBalanceEntryPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Save,
  Check,
  X,
  ChevronDown,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

interface Organization {
  id: number
  name: string
}

interface GoodsRow {
  id: number
  name: string
  warehouse: string
  quantity: number
  cost: number
  country?: string
  customs?: string
}

const GoodsBalanceEntryPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { closeTab } = useAppContext()

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<number | ''>('')
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [goodsRows, setGoodsRows] = useState<GoodsRow[]>([])
  const [responsible, setResponsible] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    axios.get<Organization[]>('/api/organizations')
      .then(res => {
        setOrganizations(res.data)
        if (res.data[0]) setSelectedOrgId(res.data[0].id)
      })
      .catch(console.error)
  }, [])

  const handleAddRow = () => {
    setGoodsRows(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        warehouse: '',
        quantity: 0,
        cost: 0,
        country: '',
        customs: '',
      }
    ])
  }

  const handleRowChange = <K extends keyof GoodsRow>(
    index: number,
    field: K,
    value: GoodsRow[K]
  ) => {
    const updated = [...goodsRows]
    updated[index] = { ...updated[index], [field]: value }
    setGoodsRows(updated)
  }

  const handleSave = () => {
    // отправка данных на бэкенд
    console.log({ selectedOrgId, entryDate, goodsRows, responsible, comment })
  }

  const handleSaveAndClose = () => {
    handleSave()
    closeTab(location.pathname)
    navigate(-1)
  }

  const handleClose = () => {
    closeTab(location.pathname)
    navigate(-1)
  }

  return (
    <div className="p-4 bg-gray-50 flex flex-col h-full overflow-hidden">
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
          <h1 className="text-xl font-semibold ml-2">Ввод остатков (Товары)</h1>
        </div>
        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full" title="Закрыть">
          <X size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center mb-4">
        {/* Левая группа кнопок */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveAndClose}
            className="px-3 py-1 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500"
          >
            Провести и закрыть
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-white border flex items-center rounded hover:bg-gray-100"
          >
            <Save size={16} className="mr-1" /> Записать
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-white border flex items-center rounded hover:bg-gray-100"
          >
            <Check size={16} className="mr-1" /> Провести
          </button>
        </div>

        {/* Кнопка "Еще" справа */}
        <div className="ml-auto">
          <button className="flex items-center px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Еще <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Организация:</span>
          <select className="border px-2 py-1 rounded" value={selectedOrgId} onChange={e => setSelectedOrgId(Number(e.target.value))}>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Дата:</label>
          <input type="date" className="border px-2 py-1 rounded" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
        </div>
      </div>

      {/* Кнопка Добавить перед таблицей */}
      <div className="flex justify-start mb-2">
        <button
          onClick={handleAddRow}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
        >
          Добавить
        </button>
      </div>

      {/* Таблица остатков */}
      <div className="flex-1 overflow-auto border bg-white rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">№</th>
              <th className="p-2 text-left">Номенклатура</th>
              <th className="p-2 text-left">Склад</th>
              <th className="p-2 text-left">Количество</th>
              <th className="p-2 text-left">Стоимость</th>
              <th className="p-2 text-left">Страна происхождения</th>
              <th className="p-2 text-left">Таможенная декларация</th>
            </tr>
          </thead>
          <tbody>
            {goodsRows.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={row.name}
                    onChange={e => handleRowChange(index, 'name', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={row.warehouse}
                    onChange={e => handleRowChange(index, 'warehouse', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-full"
                    value={row.quantity}
                    onChange={e => handleRowChange(index, 'quantity', parseFloat(e.target.value))}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-full"
                    value={row.cost}
                    onChange={e => handleRowChange(index, 'cost', parseFloat(e.target.value))}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={row.country || ''}
                    onChange={e => handleRowChange(index, 'country', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={row.customs || ''}
                    onChange={e => handleRowChange(index, 'customs', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Комментарий и ответственный */}
      <div className="flex items-center space-x-4 mt-4">
        <label className="text-sm font-medium">Комментарий:</label>
        <input type="text" className="w-100 border px-2 py-1 rounded" value={comment} onChange={e => setComment(e.target.value)} />
        <label className="text-sm font-medium">Ответственный:</label>
        <select className="w-100 border px-2 py-1 rounded" value={responsible} onChange={e => setResponsible(e.target.value)}>
          <option>—</option>
          {/* варианты из справочника */}
        </select>
      </div>
    </div>
  )
}

export default GoodsBalanceEntryPage