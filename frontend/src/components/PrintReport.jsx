import { fmt, baht, thDate, dayTxt, EXP_LABEL } from '../utils.js'

const STAT = { expired: EXP_LABEL.expired, red: EXP_LABEL.red, orange: 'เฝ้าระวัง', ok: 'ปกติ' }
const cell = 'border border-black/70 px-1.5 py-[3px] align-top'

// รายงานสำหรับพิมพ์ (ซ่อนบนหน้าจอ แสดงเฉพาะตอนสั่งพิมพ์)
export default function PrintReport({ rows, title, clinic, scope, notes }) {
  const total = rows.reduce((a, l) => a + l.qty * l.drug.price, 0)
  const now = new Date()
  return (
    <div className="hidden print:block text-black text-[11px] leading-snug">
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-10" />
          <div><div className="text-[15px] font-bold">คลังยา OutList Clinic — รายงานเวชภัณฑ์</div><div>แผนกเภสัชกรรม โรงพยาบาลกรุงเทพสิริโรจน์</div></div>
        </div>
        <div className="text-right">พิมพ์เมื่อ {thDate(now)} {now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <h1 className="text-[14px] font-bold">{title}</h1>
      <div className="mb-2">คลินิก: {clinic === 'all' ? 'ทุกคลินิก' : clinic} · ประเภท: {scope} · จำนวน {rows.length} รายการ</div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 [&>th]:border [&>th]:border-black/70 [&>th]:px-1.5 [&>th]:py-1 text-left">
            <th>#</th><th>รหัส</th><th>รายการ</th><th>ประเภท</th><th>คลินิก</th><th>Lot</th>
            <th className="text-right">คงเหลือ</th><th className="text-right">มูลค่า (฿)</th><th>วันหมดอายุ</th><th className="text-right">เหลือ</th><th>สถานะ</th><th>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l, i) => (
            <tr key={l.id} className="break-inside-avoid">
              <td className={cell}>{i + 1}</td><td className={cell}>{l.code}</td><td className={cell}>{l.drug.name}</td>
              <td className={cell}>{l.drug.type === 'supply' ? 'เวชภัณฑ์' : 'ยา'}</td><td className={cell}>{l.clinic}</td><td className={cell}>{l.lot}</td>
              <td className={`${cell} text-right`}>{fmt(l.qty)} {l.drug.unit}</td><td className={`${cell} text-right`}>{fmt(l.qty * l.drug.price, 2)}</td>
              <td className={`${cell} font-bold`}>{thDate(l.exp)}</td><td className={`${cell} text-right`}>{dayTxt(l.exp)}</td>
              <td className={`${cell} ${l.status === 'ok' ? '' : 'font-bold'}`}>{STAT[l.status]}</td><td className={cell}>{notes[`${l.clinic}|${l.lot}`] || ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr className="font-bold"><td className={cell} colSpan={7}>รวม {rows.length} รายการ</td><td className={`${cell} text-right`}>{fmt(total, 2)}</td><td className={cell} colSpan={4} /></tr></tfoot>
      </table>
      <div className="mt-10 flex justify-around break-inside-avoid">
        {['ผู้จัดทำรายงาน', 'เภสัชกรผู้ตรวจสอบ', 'หัวหน้าห้องยา'].map((t) => (
          <div key={t} className="text-center w-56"><div className="border-b border-black/70 h-8" /><div className="mt-1">{t}</div><div>วันที่ ........../........../..........</div></div>
        ))}
      </div>
    </div>
  )
}
