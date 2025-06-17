// src/pages/BalanceEntryPage.tsx
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, X, Save, Check } from 'lucide-react'

const BalanceEntryPage: React.FC = () => {
  const navigate = useNavigate()
  const { accountCode } = useParams<{ accountCode: string }>()

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
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
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Закрыть"
        >
          <X size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-2 mb-4">
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">
          <Save size={16} className="inline mr-1" />
          Записать
        </button>
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">
          <Check size={16} className="inline mr-1" />
          Провести
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Организация:</label>
          <select className="border px-2 py-1 rounded">
            <option>Приставка К. А.</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Дата:</label>
          <input type="date" className="border px-2 py-1 rounded" value="2025-05-25" readOnly />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border rounded bg-white">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left w-20">№</th>
              <th className="p-2 text-left w-40">Номенклатура</th>
              <th className="p-2 text-left w-40">Склад</th>
              <th className="p-2 text-left w-30">Количество</th>
              <th className="p-2 text-left w-30">Стоимость</th>
              <th className="p-2 text-left w-40">Страна происхождения</th>
              <th className="p-2 text-left w-60">Таможенная декларация или РНПТ</th>
            </tr>
          </thead>
          <tbody>
            {/* Здесь будут реальные строки остатков по счету */}
            <tr>
              <td className="p-2">1</td>
              <td className="p-2">Ведро</td>
              <td className="p-2">&lt;не требуется&gt;</td>
              <td className="p-2">шт</td>
              <td className="p-2"></td>
              <td className="p-2">РОССИЯ</td>
              <td className="p-2">ТД:</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BalanceEntryPage