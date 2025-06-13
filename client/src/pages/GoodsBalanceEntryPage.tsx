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
  Info,
  ArrowDown,
  ArrowUp,
  Trash2
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

interface Organization {
  id: number
  name: string
}

interface GoodsRow {
  id: number
  account: string
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
  const [editingCell, setEditingCell] = useState<{
    rowId: number
    column: keyof GoodsRow
  } | null>(null)

  const [selectedRowId, setSelectedRowId] = useState<number | null>(() => {
    return null // или первым `useEffect` ниже
  })

  const [nomenclatureModal, setNomenclatureModal] = useState<{
    visible: boolean
    targetRowIndex: number | null
  }>(() => ({ visible: false, targetRowIndex: null }))

  const [nomenclatureList, setNomenclatureList] = useState<string[]>([])

  const [accountModal, setAccountModal] = useState<{
    visible: boolean
    targetRowIndex: number | null
  }>({ visible: false, targetRowIndex: null })

  const [accountList, setAccountList] = useState<{ account: string; name: string }[]>([])
  const [selectedAccountCode, setSelectedAccountCode] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Organization[]>('/api/organizations')
      .then((res) => {
        setOrganizations(res.data)
        if (res.data[0]) setSelectedOrgId(res.data[0].id)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (goodsRows.length > 0 && selectedRowId === null) {
      setSelectedRowId(goodsRows[0].id)
    }
  }, [goodsRows, selectedRowId])

  const handleAddRow = () => {
    setGoodsRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        account: '',
        name: '',
        warehouse: '',
        quantity: 0,
        cost: 0,
        country: '',
        customs: '',
      },
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

  const handleDeleteRow = () => {
    if (selectedRowId !== null) {
      setGoodsRows(prev => prev.filter(row => row.id !== selectedRowId))
      setSelectedRowId(null)
    }
  }

  const fetchNomenclature = async () => {
    try {
      const response = await axios.get('/api/nomenclature')
      const names = response.data.map((item: any) => item.name)
      setNomenclatureList(names)
    } catch (err) {
      console.error('Ошибка загрузки номенклатуры', err)
      setNomenclatureList([])
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('/api/accounts', {
        params: { offBalance: false },
      })

      const filtered = res.data
        .filter((a: { account: string }) =>
          a.account.startsWith('41.') && !['41.11', '41.12'].includes(a.account)
        )

      setAccountList(filtered)
    } catch (err) {
      console.error('Ошибка загрузки счетов', err)
      setAccountList([])
    }
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
          <h1 className="text-xl font-semibold ml-2">Ввод остатков (создание) (Товары)</h1>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Закрыть"
        >
          <X size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center mb-4 space-x-2 justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveAndClose}
            className="px-3 py-1 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500"
          >
            Провести и закрыть
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1 bg-white border rounded hover:bg-gray-100"
          >
            <Save size={16} />
            Записать
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1 bg-white border rounded hover:bg-gray-100"
          >
            <Check size={16} />
            Провести
          </button>
          <button className="px-2 bg-white border rounded hover:bg-gray-100">
            <div className="text-xs text-green-500 -ml-2">Дт</div>
            <div className="text-xs text-red-500 ml-2">Кт</div>
          </button>
          <button className="p-2 bg-white border rounded hover:bg-gray-100" title="Информация">
            <Info size={16} />
          </button>
        </div>
        <div>
          <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Еще <ChevronDown size={16} className="ml-1 inline" />
          </button>
        </div>
      </div>

      {/* Document info */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Номер:</label>
          <input type="text" className="border px-2 py-1 rounded w-32" placeholder="" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">от:</label>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 flex-grow">
          <label className="text-sm font-medium whitespace-nowrap">Организация:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(Number(e.target.value))}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddRow}
            className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
          >
            Добавить
          </button>
          <button
            onClick={handleDeleteRow}
            disabled={selectedRowId === null}
            className="px-3 py-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <Trash2 className="text-red-500" size={16} />
          </button>
          <div>
            <button className="p-2 py-2 bg-white border border-r-0 hover:bg-gray-100" title="Вверх">
              <ArrowUp size={16} />
            </button>
            <button className="p-2 py-2 bg-white border hover:bg-gray-100" title="Вниз">
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
        <div>
          <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Еще <ChevronDown size={16} className="ml-1 inline" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-scroll border bg-white rounded">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left w-20">№</th>
              <th className="p-2 text-left w-30">Счет</th>
              <th className="p-2 text-left w-40">Номенклатура</th>
              <th className="p-2 text-left w-40">Склад</th>
              <th className="p-2 text-left w-30">Количество</th>
              <th className="p-2 text-left w-30">Стоимость</th>
              <th className="p-2 text-left w-40">Страна происхождения</th>
              <th className="p-2 text-left w-70">Таможенная декларация или РНПТ</th>
            </tr>
          </thead>
          <tbody>
            {goodsRows.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => setSelectedRowId(row.id)}
                className={`hover:bg-gray-50 cursor-pointer ${selectedRowId === row.id ? 'bg-yellow-100' : ''}`}
              >
                <td className="p-2">{index + 1}</td>

                {(['account', 'name', 'warehouse', 'quantity', 'cost', 'country', 'customs'] as (keyof GoodsRow)[]).map((field) => (
                  <td
                    key={field}
                    className="p-2"
                    onDoubleClick={() => {
                      if (field === 'name') {
                        fetchNomenclature()
                        setNomenclatureModal({ visible: true, targetRowIndex: index })
                      } else if (field === 'account') {
                        fetchAccounts()
                        setAccountModal({ visible: true, targetRowIndex: index })
                      } else {
                        setEditingCell({ rowId: row.id, column: field })
                      }
                    }}
                  >
                    {editingCell?.rowId === row.id && editingCell?.column === field ? (
                      <input
                        type="text"
                        autoFocus
                        className="w-full h-full bg-transparent px-0 py-0 border-none focus:outline-none"
                        value={(row[field] ?? '') as string | number}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            field,
                            ['quantity', 'cost'].includes(field)
                              ? parseFloat(e.target.value)
                              : e.target.value
                          )
                        }
                        onBlur={() => setEditingCell(null)}
                      />
                    ) : (
                      // отрисовка значений в ячейке
                      field === 'cost'
                        ? (row.cost ? row.cost : '') // Стоимость: пусто если 0
                        : field === 'quantity'
                          ? (row.quantity ? row.quantity : '<не требуется>') // Кол-во: <не требуется> если 0
                          : row[field]
                            ? row[field]
                            : (['account', 'country'].includes(field) ? '' : '<не требуется>')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center space-x-4 mt-4">
        <label className="text-sm font-medium">Комментарий:</label>
        <input
          type="text"
          className="w-100 border px-2 py-1 rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <label className="text-sm font-medium">Ответственный:</label>
        <select
          className="w-100 border px-2 py-1 rounded"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
        >
          <option>—</option>
        </select>
      </div>

      {nomenclatureModal.visible && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Выберите номенклатуру</h2>
            <ul className="divide-y">
              {nomenclatureList.map((item, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    if (nomenclatureModal.targetRowIndex !== null) {
                      const updated = [...goodsRows]
                      updated[nomenclatureModal.targetRowIndex].name = item
                      setGoodsRows(updated)
                    }
                    setNomenclatureModal({ visible: false, targetRowIndex: null })
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setNomenclatureModal({ visible: false, targetRowIndex: null })}
              className="mt-4 px-3 py-1 border rounded hover:bg-gray-100"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {accountModal.visible && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-[700px] max-h-[80vh] overflow-y-auto border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">План счетов бухгалтерского учета</h2>
              <button
                onClick={() => {
                  setAccountModal({ visible: false, targetRowIndex: null })
                  setSelectedAccountCode(null)
                }}
                className="text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-start mb-3">
              <button
                className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 font-semibold disabled:opacity-50"
                disabled={!selectedAccountCode}
                onClick={() => {
                  if (
                    selectedAccountCode &&
                    accountModal.targetRowIndex !== null
                  ) {
                    const updated = [...goodsRows]
                    updated[accountModal.targetRowIndex].account = selectedAccountCode
                    setGoodsRows(updated)
                  }
                  setAccountModal({ visible: false, targetRowIndex: null })
                  setSelectedAccountCode(null)
                }}
              >
                Выбрать
              </button>
            </div>

            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left border border-gray-300">Код счета</th>
                  <th className="p-2 text-left border border-gray-300">Наименование счета</th>
                </tr>
              </thead>
              <tbody>
                {accountList.map((acc, idx) => (
                  <tr
                    key={idx}
                    className={`cursor-pointer ${selectedAccountCode === acc.account ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedAccountCode(acc.account)}
                  >
                    <td className="p-2 border border-gray-300">{acc.account}</td>
                    <td className="p-2 border border-gray-300">{acc.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoodsBalanceEntryPage