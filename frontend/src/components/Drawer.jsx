import { USAGE } from '../data.js'
import { fmt, baht, thDate, dayTxt } from '../utils.js'
import { btnGhost, LI } from '../classes.js'

const Stat = ({ v, l }) => (
  <div className="bg-head rounded-[10px] px-3.5 py-2.5 flex flex-col"><b className="text-xl font-semibold">{v}</b><span className="text-[12.5px] text-mut">{l}</span></div>
)

export default function Drawer({ r, onClose }) {
  if (!r) return null
  const u = USAGE[r.key]
  const lots = [...r.lots].sort((a, b) => new Date(a.exp) - new Date(b.exp))
  return (
    <div className="fixed inset-0 bg-[rgba(20,30,40,.35)] z-20 flex justify-end items-start" onClick={onClose}>
      <aside className="bg-white w-[min(460px,100vw)] h-full overflow-auto p-[22px] shadow-[-8px_0_30px_rgba(20,35,50,.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div><h2 className="text-[19px] font-semibold">{r.drug.name}</h2><span className="text-mut">{r.drug.code} · {r.clinic}</span></div>
          <button className={btnGhost} onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Stat v={fmt(r.stock)} l={`คงเหลือ (${r.drug.unit})`} />
          <Stat v={fmt(r.avg, 2)} l="เฉลี่ย/วัน" />
          <Stat v={r.coverage === Infinity ? '—' : fmt(r.coverage)} l="ใช้ได้อีก (วัน)" />
          <Stat v={baht(r.value)} l="มูลค่า" />
        </div>
        <h3 className="text-sm font-semibold text-mut mt-[22px] mb-2">Lot</h3>
        {lots.map((l) => (
          <div key={l.lot} className={`flex justify-between items-center px-3 py-[9px] rounded-lg mb-1 text-sm ${LI[l.status]}`}>
            <div><b>{l.lot}</b><div className="text-xs text-mut leading-[1.3]">{fmt(l.qty)} {r.drug.unit} · {baht(l.qty * r.drug.price)}</div></div>
            <div className="text-right"><b>{thDate(l.exp)}</b><div className="text-xs text-mut leading-[1.3]">เหลือ {dayTxt(l.exp)}</div></div>
          </div>
        ))}
        <h3 className="text-sm font-semibold text-mut mt-[22px] mb-2">เฉลี่ยอัตราการใช้ย้อนหลัง</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {[30, 90, 180].map((d) => <Stat key={d} v={fmt(u[`out${d}`])} l={`${d} วัน`} />)}
        </div>
      </aside>
    </div>
  )
}
