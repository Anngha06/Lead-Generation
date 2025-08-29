import React from 'react'

export default function Sidebar({ tabs, current, setCurrent, onNewTab, role }) {
  const grouped = {}
  tabs.forEach(t => { (grouped[t.group] ||= []).push(t) })

  return (
    <aside className="border-r border-border bg-card p-4 flex flex-col justify-between min-h-screen">
      <div>
        <h3 className="text-sm text-body/70 mb-2">Navigation</h3>
        <nav>
          {Object.keys(grouped).sort().map(g => (
            <div key={g} className="mb-3">
              <h4 className="text-xs uppercase tracking-wide text-body/60 mb-1">{g}</h4>
              {grouped[g].map(t => (
                <button key={t.id}
                  className={`sidebar-btn mb-1 ${t.id===current?'sidebar-btn-active':''}`}
                  onClick={()=>setCurrent(t.id)}>{t.title}</button>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="pt-2 border-t border-border">
        {role==='admin' && <button className="btn btn-primary w-full" onClick={onNewTab}>+ New Tab</button>}
      </div>
    </aside>
  )
}
