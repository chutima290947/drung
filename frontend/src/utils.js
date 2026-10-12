import { USAGE, CLINICS } from './data.js'

export const DEFAULTS = { redMonths: 6, orangeMonths: 8, window: 90, overstockDays: 180, noMoveDays: 90, minDays: 14 }
export const fmt = (n, d = 0) => Number(n).toLocaleString('th-TH', { maximumFractionDigits: d })
export const baht = (n) => '฿' + fmt(n)
export const thDate = (s) => new Date(s).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
const addMonths = (m) => { const d = new Date(); d.setMonth(d.getMonth() + m); return d }

// คำนวณสถานะ Exp จากวันที่ปัจจุบัน (ไม่ให้กรอกสีเอง)
export function expStatus(exp, cfg) {
  const e = new Date(exp), now = new Date()
  if (e < now) return 'expired'
  if (e <= addMonths(cfg.redMonths)) return 'red'
  if (e <= addMonths(cfg.orangeMonths)) return 'orange'
  return 'ok'
}
export const EXP_LABEL = { expired: 'หมดอายุห้ามใช้ ส่งคืนห้องยา', red: 'ใกล้หมดอายุ แลกเปลี่ยนห้องยา', orange: 'เฝ้าระวัง', ok: '' }

// ข้อมูลยา (ชื่อ/หน่วย/ราคา) — เติมจาก API ตอนโหลด (ดู App.jsx loadAll)
export const drugMap = {}

// รวมระดับ ยา x คลินิก
export function summarize(lots, cfg) {
  const map = {}
  lots.forEach((l) => {
    const k = `${l.clinic}|${l.code}`
    const d = drugMap[l.code]
    const r = (map[k] ??= { key: k, clinic: l.clinic, drug: d, stock: 0, lots: [] })
    r.stock += l.qty
    r.lots.push({ ...l, status: expStatus(l.exp, cfg) })
  })
  return Object.values(map).map((r) => {
    const u = USAGE[r.key] ?? { out30: 0, out90: 0, out180: 0 }
    const tracked = (r.drug.type || 'drug') !== 'supply' // เวชภัณฑ์กรอกเอง ไม่มีข้อมูลการจ่าย จึงไม่วิเคราะห์การใช้
    const out = tracked ? (u[`out${cfg.window}`] ?? u.out90) : 0
    const avg = out / cfg.window
    const coverage = avg > 0 ? r.stock / avg : Infinity
    return {
      ...r, nearest: r.lots.reduce((a, l) => (new Date(l.exp) < new Date(a.exp) ? l : a)), avg, coverage, value: r.stock * r.drug.price,
      tracked, noMove: tracked && ((u.out30 === 0 && cfg.noMoveDays <= 30) || (u.out90 === 0 && cfg.noMoveDays <= 90) || (u.out180 === 0 && cfg.noMoveDays > 90)),
      overstock: tracked && coverage > cfg.overstockDays,
      low: tracked && avg > 0 && coverage < cfg.minDays,
      worst: r.lots.reduce((w, l) => (['expired', 'red', 'orange', 'ok'].indexOf(l.status) < ['expired', 'red', 'orange', 'ok'].indexOf(w) ? l.status : w), 'ok'),
    }
  })
}

export const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
export const daysTo = (e) => Math.ceil((new Date(e) - Date.now()) / 864e5)
export const dayTxt = (e) => { const d = daysTo(e); return d < 0 ? `เกินมา ${fmt(-d)} วัน` : `${fmt(d)} วัน` }
export const cov = (c) => (c === Infinity ? 'ไม่มีการใช้' : `${fmt(c)} วัน`)
export const BRANCH = { 'BCA Airport Clinic': 'สนามบิน (Airport)', 'BKL Khaolak Stock': 'เขาหลัก (Khaolak)', 'BKM Kamala Stock': 'กมลา (Kamala)', 'BPT Patong Stock': 'ป่าตอง (Patong)', 'BRW Rawai Stock': 'ราไวย์ (Rawai)', 'TLC SrisunthonClinic': 'ศรีสุนทร (Srisunthon)' }
export const short = (c) => c.split(' ')[0]
// ย้ายข้อมูลเก่าที่บันทึกไว้ในเบราว์เซอร์ (ชื่อ คลินิก A–F) ไปเป็นชื่อจริง
const LEGACY = Object.fromEntries(['A', 'B', 'C', 'D', 'E', 'F'].map((x, i) => [`คลินิก ${x}`, CLINICS[i]]))
export const fixClinic = (c) => (CLINICS.includes(c) ? c : LEGACY[c] ?? null)
export const fixNotes = (n) => Object.fromEntries(Object.entries(n).map(([k, v]) => {
  const i = k.indexOf('|'), c = fixClinic(k.slice(0, i))
  return c ? [c + k.slice(i), v] : null
}).filter(Boolean))