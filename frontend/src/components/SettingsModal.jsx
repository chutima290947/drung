import { DEFAULTS } from '../utils.js'
import { field, btnGhost, btnPrimary } from '../classes.js'

const row = 'flex justify-between items-center gap-3 text-[14.5px]'

export default function SettingsModal({ draft, setDraft, setC, dirty, err, save, saved, setSaved, onClose }) {
  const cfgFields = [['redMonths', '🔴 ใกล้หมดอายุ แลกเปลี่ยนห้องยา', 'เดือน'], ['orangeMonths', '🟠 เฝ้าระวัง', 'เดือน'], ['overstockDays', '🟣 Overstock เมื่อใช้ได้เกิน', 'วัน'],
    ['noMoveDays', '⚪ ไม่เคลื่อนไหว', 'วัน'], ['minDays', '🔵 ใกล้หมดเมื่อใช้ได้น้อยกว่า', 'วัน']]
  return (
    <div className="fixed inset-0 bg-[rgba(20,30,40,.35)] z-20 flex justify-end items-start" onClick={() => onClose()}>
      <div className="bg-white rounded-2xl shadow-card p-6 w-[min(440px,92vw)] mt-[8vh] mx-auto grid gap-3.5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-[19px] font-semibold">ตั้งค่าเกณฑ์การแจ้งเตือน</h2>
        {cfgFields.map(([k, l, u]) => (
          <label key={k} className={row}>{l}<span><input className={`${field} w-[90px] text-right`} type="number" min="1" value={draft[k]} onChange={setC(k)} /> {u}</span></label>
        ))}
        <label className={row}>เฉลี่ยอัตราการใช้ย้อนหลัง
          <select className={field} value={draft.window} onChange={setC('window')}><option value={30}>30 วัน</option><option value={90}>90 วัน</option><option value={180}>180 วัน</option></select>
        </label>
        <div className="flex items-center gap-2.5 flex-wrap pt-1.5">
          <button className={btnPrimary} onClick={save} disabled={!dirty || !!err}>บันทึก</button>
          <button className={btnGhost} onClick={() => { setDraft(DEFAULTS); setSaved(false) }}>คืนค่าเริ่มต้น</button>
          <button className={btnGhost} onClick={() => onClose()}>ปิด</button>
          {err && <span className="text-[#a8322a] text-[13px]">{err}</span>}
          {saved && !dirty && <span className="text-accent text-[13px] font-medium">✓ บันทึกแล้ว</span>}
        </div>
      </div>
    </div>
  )
}
