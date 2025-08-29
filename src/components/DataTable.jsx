import React from 'react'
import { sendToSheet } from '../lib/api'

export default function DataTable({ tab, rows, role, reload }) {
  const canDelete = role==='admin' || role==='intern'

  async function onDelete(id){
    if(!canDelete) return
    await sendToSheet({ action:'delete', tab: tab.id, id })
    reload && reload()
  }

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold">Saved Entries</h3>
        <button className="btn" onClick={()=>exportCSV(tab,rows)}>Export CSV</button>
      </div>
      <div className="overflow-auto border border-border rounded-2xl">
        <table>
          <thead>
            <tr>
              {tab.fields.map(f => <th key={f.key}>{f.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id || i}>
                {tab.fields.map(f => <td key={f.key}>{String(r[f.key] ?? '')}</td>)}
                <td>
                  {!tab.readonly && (
                    <button className="btn btn-danger" disabled={!canDelete} onClick={()=>onDelete(r.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function exportCSV(tab, rows){
  const headers = tab.fields.map(f=>f.label)
  const keys = tab.fields.map(f=>f.key)
  const csv = [headers.join(',')].concat(
    rows.map(r => keys.map(k => JSON.stringify(String(r[k] ?? ''))).join(','))
  ).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${tab.id}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
