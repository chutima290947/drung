// ตัวเรียก backend (Vite ส่ง /api ต่อไปที่ http://localhost:4000 — ดู vite.config.js)
async function req(path, opts = {}) {
  const res = await fetch('/api' + path, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) {
    let msg = res.statusText
    try { msg = (await res.json()).error || msg } catch {}
    throw Object.assign(new Error(msg), { status: res.status })
  }
  return res.status === 204 ? null : res.json()
}
const body = (b) => ({ body: JSON.stringify(b) })

export const api = {
  lots: () => req('/lots'),
  usage: () => req('/usage'),
  drug: (code) => req('/drugs/' + encodeURIComponent(code)),
  drugs: (q, type) => req('/drugs?q=' + encodeURIComponent(q) + (type ? '&type=' + type : '')),
  addLot: (b) => req('/lots', { method: 'POST', ...body(b) }),
  delLot: (id) => req('/lots/' + id, { method: 'DELETE' }),
  noteLot: (id, note) => req('/notes/lot/' + id, { method: 'PUT', ...body({ note }) }),
  noteDrug: (clinic, drug, note) => req(`/notes/drug/${clinic}/${drug}`, { method: 'PUT', ...body({ note }) }),
  settings: () => req('/settings'),
  saveSettings: (v) => req('/settings', { method: 'PUT', ...body(v) }),
}
