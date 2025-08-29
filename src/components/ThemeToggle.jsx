import React from 'react'
export default function ThemeToggle() {
  const toggle=()=>{
    const root=document.documentElement
    const curr=root.classList.contains('dark')?'dark':'light'
    const next=curr==='dark'?'light':'dark'
    root.classList.remove(curr); root.classList.add(next)
    localStorage.setItem('theme', next)
  }
  return <button className="btn" onClick={toggle}>Toggle Theme</button>
}
