import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { sendToSheet } from '../lib/api'

export default function TabForm({ tab, role, onAdded }) {
  if (tab.readonly) {
    return <div className="card"><div className="text-sm">Read-only tab. Data comes from the sheet.</div></div>
  }
  const [values, setValues] = useState(Object.fromEntries(tab.fields.map(f=>[f.key,''])))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const canWrite = role==='admin' || role==='intern'

  async function submit(e){
    e.preventDefault()
    if(!canWrite) return
    setBusy(true); setError('')
    try{
      const id = uuidv4()
      await sendToSheet({ action:'append', tab: tab.id, id, values, meta:{ by: role, ts: new Date().toISOString() } })
      setValues(Object.fromEntries(tab.fields.map(f=>[f.key,''])))
      onAdded && onAdded()
    }catch(err){ setError(err.message||'Failed') }
    finally{ setBusy(false) }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-2">{tab.title} — Add Entry</h2>
      {!canWrite && <div className="mb-2 text-sm text-body/70">Login to add entries.</div>}
      <form onSubmit={submit} className="grid grid-cols-12 gap-3">
        {tab.fields.map(f=> (
          <div key={f.key} className="col-span-12 md:col-span-6 flex flex-col gap-1">
            <label className="text-xs text-body/70">{f.label}</label>
            {f.type==='textarea' ? (
              <textarea placeholder={f.label} value={values[f.key]}
                onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))}/>
            ) : (
              <input type={f.type||'text'} placeholder={f.label} value={values[f.key]}
                onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} required={!!f.required}/>
            )}
          </div>
        ))}
        <div className="col-span-12 flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={!canWrite || busy}>
            {busy?'Saving…':'Add'}
          </button>
        </div>
      </form>
      {error && <div className="mt-2 text-danger text-sm">{error}</div>}
    </div>
  )
}
