import React, { useState } from 'react'

export default function LoginModal({ onLogin }) {
  const [name, setName] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <div className="overlay">
      <div className="modal">
        <h2 className="text-xl font-bold mb-2">Sign in</h2>
        <div className="grid gap-2 mb-3">
          <input
            className="w-full"
            placeholder="Your name"
            value={name}
            onChange={e=>setName(e.target.value)}
          />
          <input
            type="password"
            autoComplete="new-password"
            className="w-full"
            placeholder=""
            value={pwd}
            onChange={e=>setPwd(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={()=>onLogin({ pwd, name })}>
          Login
        </button>
      </div>
    </div>
  )
}
