// ข้อมูลตัวอย่าง (mock) — แทนที่ด้วย fetch จาก API/HIS ภายหลัง
export const CLINICS = ['BCA Airport Clinic', 'BKL Khaolak Stock', 'BKM Kamala Stock', 'BPT Patong Stock', 'BRW Rawai Stock', 'TLC SrisunthonClinic']

export const DRUGS = [
  ['D001', 'Paracetamol 500 mg', 'เม็ด', 0.5, 40], ['D002', 'Amoxicillin 500 mg', 'แคปซูล', 3, 18],
  ['D003', 'Metformin 500 mg', 'เม็ด', 1.2, 25], ['D004', 'Loratadine 10 mg', 'เม็ด', 2, 8],
  ['D005', 'Omeprazole 20 mg', 'แคปซูล', 2.5, 14], ['D006', 'Amlodipine 5 mg', 'เม็ด', 1.5, 20],
  ['D007', 'Simvastatin 20 mg', 'เม็ด', 1.8, 12], ['D008', 'Ibuprofen 400 mg', 'เม็ด', 1, 10],
  ['D009', 'Vitamin B complex', 'เม็ด', 0.8, 5], ['D010', 'ORS ซอง', 'ซอง', 6, 3],
  ['D011', 'Cetirizine 10 mg', 'เม็ด', 1.4, 6], ['D012', 'Salbutamol MDI', 'ขวด', 95, 0.4],
  ['D013', 'Losartan 50 mg', 'เม็ด', 2.2, 11], ['D014', 'Dextromethorphan', 'เม็ด', 1.1, 0],
  ['D015', 'Ranitidine 150 mg', 'เม็ด', 1.3, 0], ['D016', 'Diclofenac 25 mg', 'เม็ด', 1.6, 4],
].map(([code, name, unit, price, rate]) => ({ code, name, unit, price, rate }))

let s = 7
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
const days = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

// lots: 1 ยา/คลินิก มีได้หลาย Lot
export const LOTS = []
// สรุปการจ่ายออก 30/90/180 วัน ต่อ ยา+คลินิก (มาจาก Movement)
export const USAGE = {}
CLINICS.forEach((c) => DRUGS.forEach((d) => {
  const rate = d.rate * (0.5 + rnd()) * (rnd() < 0.08 ? 0 : 1)
  USAGE[`${c}|${d.code}`] = { out30: Math.round(rate * 30), out90: Math.round(rate * 90), out180: Math.round(rate * 180) }
  const n = 1 + Math.floor(rnd() * 3)
  for (let i = 0; i < n; i++) {
    const over = d.rate === 0 || rnd() < 0.1
    LOTS.push({
      clinic: c, code: d.code, lot: `${d.code}-L${i + 1}`,
      qty: Math.round((rate * (over ? 400 : 60) + 50) * (0.4 + rnd())),
      exp: days(Math.floor(-20 + rnd() * 720)),
    })
  }
}))

// Movement ตัวอย่าง (mock) — ต่อ API จริงภายหลัง
export function movements(clinic, code) {
  const per = USAGE[`${clinic}|${code}`].out30
  let h = [...(clinic + code)].reduce((a, c) => a + c.charCodeAt(0), 0)
  const n = per === 0 ? 1 : 7
  return Array.from({ length: n }, (_, i) => {
    h = (h * 31 + 7) % 997
    const date = new Date(); date.setDate(date.getDate() - (i * 4 + (h % 3)))
    if (per === 0) return { date, type: 'รับเข้า', qty: 50 }
    return i === n - 1 ? { date, type: 'รับเข้า', qty: Math.round(per * 2) } : { date, type: 'จ่ายออก', qty: -Math.max(1, Math.round(per / 5)) }
  })
}