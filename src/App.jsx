import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import LoginModal from './components/LoginModal.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import TabForm from './components/TabForm.jsx'
import DataTable from './components/DataTable.jsx'
import AddTabModal from './components/AddTabModal.jsx'
import { DEFAULT_TABS } from './lib/schema.js'
import { sendToSheet } from './lib/api.js'

const LS_SCHEMA = 'aceint_schema_v4'
const LS_ROLE = 'aceint_role'
const LS_THEME = 'theme'

function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') }

export default function App(){
  const [role, setRole] = useState(localStorage.getItem(LS_ROLE) || '')
  const [tabs, setTabs] = useState(loadSchema())
  const [current, setCurrent] = useState(tabs[0]?.id || '')
  const [rows, setRows] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  useEffect(()=>{
    const t = localStorage.getItem(LS_THEME) || (window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')
    document.documentElement.classList.remove('light','dark'); document.documentElement.classList.add(t)
    localStorage.setItem(LS_THEME, t)
  }, [])

  useEffect(()=>{ if(current) refresh() }, [current])

  async function refresh(){
    try{
      const res = await sendToSheet({ action:'list', tab: current })
      setRows(res.rows || [])
    } catch { setRows([]) }
  }

  function onLogin(pwd){
    const r = pwd==='2001' ? 'admin' : (pwd==='1111' ? 'intern' : '')
    if(!r) return
    localStorage.setItem(LS_ROLE, r); setRole(r)
  }
  function logout(){ localStorage.removeItem(LS_ROLE); setRole('') }

  async function onCreateTab({ name, group, fields }) {
    const id = slugify(name)
    if (tabs.find(t => t.id === id)) return alert('Tab already exists')

    const fs = fields.split(',').map(s => s.trim()).filter(Boolean).map(label => {
      const key = slugify(label)
      let type = 'text'
      const l = label.toLowerCase()
      if (l.includes('email')) type = 'email'
      else if (l.includes('phone') || l.includes('mobile')) type = 'tel'
      else if (l.includes('url') || l.includes('link')) type = 'url'
      else if (l.includes('notes') || l.includes('description')) type = 'textarea'
      else if (l.includes('number') || l.includes('strength') || l.includes('count')) type = 'number'
      return { key, label, type }
    })

    // create the Google Sheet tab using the same slug as the tab id
    await sendToSheet({
      action: 'create_tab',
      sheet_name: id,
      fields: fs.map(f => f.key)
    })

    const next = [...tabs, { id, title: name, group, fields: fs }]
    localStorage.setItem(LS_SCHEMA, JSON.stringify({ tabs: next }))
    setTabs(next)
    setCurrent(id)
    setShowAdd(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      {!role && <LoginModal onLogin={onLogin} />}
      <Sidebar tabs={tabs} current={current} setCurrent={setCurrent} onNewTab={()=> role==='admin' && setShowAdd(true)} role={role} />
      <main className="p-4 space-y-3">
        <header className="flex items-center justify-between card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center font-black">AI</div>
            <div>
              <h1 className="text-lg font-bold leading-tight">AceInt Dashboard</h1>
              <div className="text-sm text-body/70">Lead Generation & Operations</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="pill">Role: {role || '—'}</span>
            {role && <button className="btn btn-ghost" onClick={logout}>Logout</button>}
            <ThemeToggle />
          </div>
        </header>

        <div className="text-sm text-body/70">
          {tabs.find(t=>t.id===current)?.group} / {tabs.find(t=>t.id===current)?.title}
        </div>

        {current && (<>
          <TabForm tab={tabs.find(t=>t.id===current)} role={role} onAdded={refresh} />
          <DataTable tab={tabs.find(t=>t.id===current)} rows={rows} role={role} reload={refresh} />
        </>)}
      </main>

      {showAdd && <AddTabModal onClose={()=>setShowAdd(false)} onCreate={onCreateTab} />}
    </div>
  )
}

function loadSchema(){
  try{
    const raw = localStorage.getItem(LS_SCHEMA); if(raw) return JSON.parse(raw).tabs
  }catch{}
  return DEFAULT_TABS
}
