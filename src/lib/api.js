const GAS_URL = import.meta.env.VITE_GAS_URL || ''

export async function sendToSheet(payload) {
  if (!GAS_URL) throw new Error('VITE_GAS_URL is missing')
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // <- important
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  try { return JSON.parse(text) } catch { return { ok: true } }
}

