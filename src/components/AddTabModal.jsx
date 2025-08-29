import React, { useState } from 'react'

export default function AddTabModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [group, setGroup] = useState('Lead Generation')
  const [fields, setFields] = useState('Name, Email, Phone')

  return (
    <div className="overlay">
      <div className="modal">
        <h2 className="text-xl font-bold mb-2">Create New Tab</h2>
        <label className="text-xs text-body/70">Tab name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Recruiters"/>
        <label className="text-xs text-body/70 mt-2">Group name</label>
        <input value={group} onChange={e=>setGroup(e.target.value)} placeholder="e.g., Lead Generation"/>
        <label className="text-xs text-body/70 mt-2">Fields (comma-separated)</label>
        <input value={fields} onChange={e=>setFields(e.target.value)} placeholder="e.g., Name, Email, Phone"/>
        <div className="flex gap-2 mt-3">
          <button className="btn btn-primary" onClick={()=>onCreate({ name, group, fields })}>Create</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
