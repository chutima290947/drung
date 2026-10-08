import { CLINICS } from '../data.js'
import { baht } from '../utils.js'
import { field, btnGhost, btnPrimary } from '../classes.js'

const row = 'flex justify-between items-center gap-3 text-[14.5px]'
const num = `${field} w-[90px] text-right`
const wide = `${field} w-[150px]`

export default function AddItemModal({ form, F, master, checking, sugg = [], dup, formOk, addItem, onClose }) {
  return (
    <div className="fixed inset-0 bg-[rgba(20,30,40,.35)] z-20 flex justify-end items-start" onClick={() => onClose()}>
      <div className="bg-white rounded-2xl shadow-card p-6 w-[min(440px,92vw)] mt-[8vh] mx-auto grid gap-3.5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-[19px] font-semibold">เพิ่มรายการเวชภัณฑ์</h2>
        <label className={row}>รหัสยา
          <input list="codes" className={`${wide} text-left`} placeholder="เช่น D001" value={form.code} onChange={F('code')} autoFocus />
        </label>
        <datalist id="codes">{sugg.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}</datalist>
        {form.code && (master
          ? <div className="bg-accent-soft rounded-[10px] px-3.5 py-2.5 flex flex-col text-sm"><b>{master.name}</b><span className="text-mut text-[13px]">หน่วย: {master.unit} · ราคา/หน่วย {baht(master.price)}</span></div>
          : checking ? <div className="text-mut text-[13px]">กำลังค้นหา...</div>
          : <div className="text-[#a8322a] text-[13px]">ไม่พบรหัสยานี้ในฐานข้อมูล</div>)}
        <label className={row}>คลินิก<select className={field} value={form.clinic} onChange={F('clinic')}>{CLINICS.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className={row}>Lot<input className={`${wide} text-left`} value={form.lot} onChange={F('lot')} /></label>
        <label className={row}>จำนวน<span><input className={num} type="number" min="1" value={form.qty} onChange={F('qty')} /> {master?.unit}</span></label>
        <label className={row}>วันหมดอายุ<input type="date" className={`${wide} text-right`} value={form.exp} onChange={F('exp')} /></label>
        <div className={row}>มูลค่า<b>{master && +form.qty > 0 ? baht(form.qty * master.price) : '—'}</b></div>
        {dup && <div className="text-[#a8322a] text-[13px]">Lot นี้มีอยู่แล้วในคลินิกนี้</div>}
        <div className="flex items-center gap-2.5 flex-wrap pt-1.5">
          <button className={btnPrimary} onClick={addItem} disabled={!formOk}>เพิ่มรายการ</button>
          <button className={btnGhost} onClick={() => onClose()}>ยกเลิก</button>
        </div>
      </div>
    </div>
  )
}