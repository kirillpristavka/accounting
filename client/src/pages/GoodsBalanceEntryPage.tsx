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
  quantity: string | number // ← всегда строка
  cost: string | number    // ← всегда строка
  country?: string
  customs?: string
  unit?: string
}

interface NomenclatureItem {
  id: number
  name: string
  article?: string
  unit?: string
  vat?: number
  country?: string
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
    selectedIndex: number | null
  }>({
    visible: false,
    targetRowIndex: null,
    selectedIndex: null,
  })

  const [nomenclatureList, setNomenclatureList] = useState<NomenclatureItem[]>([])

  const [accountModal, setAccountModal] = useState<{
    visible: boolean
    targetRowIndex: number | null
  }>({ visible: false, targetRowIndex: null })

  const [accountList, setAccountList] = useState<{ account: string; name: string }[]>([])
  const [selectedAccount, setSelectedAccount] = useState<{ account: string; name: string } | null>(null)

  const [inputTempValue, setInputTempValue] = useState<string | null>(null)

  const [documentNumber, setDocumentNumber] = useState<number | null>(null)

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('ru-RU')

  const [pageTitle, setPageTitle] = useState('Ввод остатков (создание) (Товары)')

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
    setGoodsRows(prev => [
      ...prev,
      {
        id: Date.now(),
        account: '',
        name: '',
        warehouse: '',
        quantity: '', // ← пустая строка
        cost: '',     // ← пустая строка
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

  const handleSave = async () => {
    try {
      const prepared = goodsRows.map(row => ({
        ...row,
        quantity: row.quantity === '' ? 0 : Number(row.quantity),
        cost: row.cost === '' ? 0 : Number(row.cost),
      }))

      const res = await axios.post('/api/goods-balance', {
        date: entryDate,
        orgId: selectedOrgId,
        comment,
        responsible,
        rows: prepared,
      })

      setDocumentNumber(res.data.number)
      setPageTitle(`Ввод остатков ${res.data.number.toString().padStart(10, '0')} от ${formatDate(entryDate)}`)
    } catch (err) {
      console.error(err)
      alert('Ошибка при сохранении документа')
    }
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
      const response = await axios.get<NomenclatureItem[]>('/api/nomenclature')
      setNomenclatureList(response.data)
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
          <h1 className="text-xl font-semibold ml-2">
            {documentNumber
              ? `Ввод остатков ${documentNumber.toString().padStart(10, '0')} от ${formatDate(entryDate)} (Товары)`
              : 'Ввод остатков (создание) (Товары)'}
          </h1>
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
          <input
            type="text"
            className="border px-2 py-1 rounded w-32"
            placeholder=""
            value={documentNumber ? documentNumber.toString().padStart(10, '0') : ''}
          />
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
            {goodsRows.map((row, index) => {
              const isAccountSelected = !!row.account

              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedRowId(row.id)}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedRowId === row.id ? 'bg-yellow-100' : ''}`}
                >
                  <td className="p-2">{index + 1}</td>

                  {(['account', 'name', 'warehouse', 'quantity', 'cost', 'country', 'customs'] as (keyof GoodsRow)[]).map((field) => {
                    const isEditable = (
                      field === 'account' ||
                      (isAccountSelected && ['name', 'quantity', 'cost', 'country'].includes(field))
                    )

                    const showPlaceholder = (
                      (field === 'name' || field === 'quantity') && !isAccountSelected ||
                      (field === 'warehouse' || field === 'customs')
                    )

                    const isEditing = editingCell?.rowId === row.id && editingCell?.column === field
                    const isNumeric = ['quantity', 'cost'].includes(field)

                    return (
                      <td
                        key={field}
                        className="p-2"
                        onDoubleClick={() => {
                          if (!isEditable) return
                          if (field === 'name') {
                            fetchNomenclature()
                            setNomenclatureModal({ visible: true, targetRowIndex: index, selectedIndex: null })
                          } else if (field === 'account') {
                            fetchAccounts()
                            setAccountModal({ visible: true, targetRowIndex: index })
                          } else {
                            setEditingCell({ rowId: row.id, column: field })
                          }
                        }}
                      >
                        {isEditing && field === 'quantity' ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              autoFocus
                              inputMode="decimal"
                              className="w-full h-full bg-transparent px-0 py-0 border-none focus:outline-none"
                              value={
                                isEditing && row[field] === ''
                                  ? inputTempValue ?? '0'
                                  : inputTempValue ?? String(row[field] ?? '')
                              }
                              onFocus={(e) => {
                                e.target.setSelectionRange(0, e.target.value.length)
                                setInputTempValue(null)
                              }}
                              onChange={(e) => {
                                const raw = e.target.value
                                setInputTempValue(raw)

                                if (raw === '') {
                                  handleRowChange(index, field, '')
                                } else if (/^\d*\.?\d*$/.test(raw)) {
                                  handleRowChange(index, field, raw)
                                }
                              }}
                              onBlur={() => {
                                setEditingCell(null)
                                setInputTempValue(null)
                              }}
                            />
                            {row.unit && <span className="text-gray-500">{row.unit}</span>}
                          </div>
                        ) : isEditing ? (
                          <input
                            type="text"
                            autoFocus
                            inputMode={isNumeric ? 'decimal' : undefined}
                            className="w-full h-full bg-transparent px-0 py-0 border-none focus:outline-none"
                            value={
                              inputTempValue !== null
                                ? inputTempValue
                                : (isNumeric && row[field] === '' ? '0' : String(row[field] ?? ''))
                            }
                            onFocus={(e) => {
                              e.target.setSelectionRange(0, e.target.value.length)
                              setInputTempValue(null)
                            }}
                            onChange={(e) => {
                              const raw = e.target.value
                              setInputTempValue(raw)

                              if (isNumeric) {
                                if (raw === '') {
                                  handleRowChange(index, field, '')
                                } else if (/^\d*\.?\d*$/.test(raw)) {
                                  handleRowChange(index, field, raw)
                                }
                              } else {
                                handleRowChange(index, field, raw)
                              }
                            }}
                            onBlur={() => {
                              setEditingCell(null)
                              setInputTempValue(null)
                            }}
                          />
                        ) : (
                          field === 'quantity'
                            ? (
                              <div className="flex justify-between items-center">
                                <span>{row.quantity !== '' ? row.quantity : ''}</span>
                                {row.unit && <span className="text-gray-500 ml-1">{row.unit}</span>}
                              </div>
                            ) : field === 'customs'
                              ? (row.customs !== '' ? row.customs : (showPlaceholder ? '<не требуется>' : ''))
                              : (showPlaceholder ? '<не требуется>' : (row[field] !== '' ? row[field] : ''))
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
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
          <div className="bg-white rounded shadow p-4 w-[800px] max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Номенклатура: Товары на складе</h2>
              <button
                onClick={() => setNomenclatureModal({ visible: false, targetRowIndex: null, selectedIndex: null })}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={() => {
                  if (
                    nomenclatureModal.targetRowIndex !== null &&
                    nomenclatureModal.selectedIndex !== null
                  ) {
                    const selected = nomenclatureList[nomenclatureModal.selectedIndex]
                    const updated = [...goodsRows]
                    const row = updated[nomenclatureModal.targetRowIndex]

                    row.name = selected.name
                    row.country = selected.country || ''

                    if (selected.country?.toUpperCase() === 'РОССИЯ') {
                      row.customs = 'ТД'
                    }

                    if (selected.unit) {
                      row.unit = selected.unit
                    }

                    setGoodsRows(updated)
                  }

                  setNomenclatureModal({
                    visible: false,
                    targetRowIndex: null,
                    selectedIndex: null,
                  })
                }}
                className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                Выбрать
              </button>
              <button className="px-3 py-1 bg-white border rounded">Создать</button>
              <button className="px-3 py-1 bg-white border rounded">Создать группу</button>
              <button className="px-3 py-1 bg-white border rounded">?</button>
            </div>

            {/* Table */}
            <div className="overflow-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Наименование</th>
                    <th className="p-2 text-left">Артикул</th>
                    <th className="p-2 text-left">Единица</th>
                    <th className="p-2 text-left">% НДС</th>
                  </tr>
                </thead>
                <tbody>
                  {nomenclatureList.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer ${nomenclatureModal.selectedIndex === idx ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
                      onClick={() =>
                        setNomenclatureModal((prev) => ({ ...prev, selectedIndex: idx }))
                      }
                    >
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.article}</td>
                      <td className="p-2">{item.unit}</td>
                      <td className="p-2">{item.vat}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  setSelectedAccount(null)
                }}
                className="text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-start mb-3">
              <button
                className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 font-semibold disabled:opacity-50"
                disabled={!selectedAccount}
                onClick={() => {
                  if (accountModal.targetRowIndex !== null && selectedAccount) {
                    const updated = [...goodsRows]
                    const row = updated[accountModal.targetRowIndex]

                    // ✅ Установим выбранный счёт
                    row.account = selectedAccount.account

                    // ✅ Разрешим редактирование, очистив <не требуется> (но НЕ ставим 0!)
                    if (!row.name || row.name === '<не требуется>') row.name = ''
                    if (row.quantity === '' || row.quantity === '<не требуется>' || row.quantity === 0) row.quantity = ''

                    setGoodsRows(updated)
                    setAccountModal({ visible: false, targetRowIndex: null })
                    setSelectedAccount(null)
                  }
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
                    className={`cursor-pointer ${
                      selectedAccount?.account === acc.account
                        ? 'bg-yellow-100'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedAccount(acc)}
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