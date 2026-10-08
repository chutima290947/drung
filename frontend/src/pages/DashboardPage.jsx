import { CLINICS } from '../data.js'
import { fmt, baht, EXP_LABEL, BRANCH, short } from '../utils.js'
import { SC, XC, Th, Td } from '../components/ui.jsx'
import { card, ROW } from '../classes.js'

const dotCls = 'inline-block w-2.5 h-2.5 rounded-full mr-1.5 flex-none'

export default function DashboardPage({ d }) {
  const { cfg, rows, cnt, by, where, go, total, stat, sum, risk, busy } = d
  const jump = (f) => ({ onClick: () => go('inv', { f }), onKeyDown: (e) => e.key === 'Enter' && go('inv', { f }) })
  const nClinics = new Set(rows.map((r) => r.clinic)).size
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-[22px]">
        <XC c="d" n={cnt('expired')} tag="เร่งด่วน ดำเนินการทันที" title={`Lot ${EXP_LABEL.expired}`} foot={`พบใน ${where('expired')}`} {...jump('expired')} />
        <XC c="r" n={cnt('red')} tag="ประสานงานแลกเปลี่ยนยา" title={`Lot ${EXP_LABEL.red} (≤ ${cfg.redMonths} เดือน)`}
            foot={`เฉลี่ย ${fmt(cnt('red') / (nClinics || 1), 1)} รายการ / คลินิก`} {...jump('red')} />
        <XC c="o" n={cnt('orange')} tag="ติดตามอัตราการใช้" title={`Lot เฝ้าระวัง (≤ ${cfg.orangeMonths} เดือน)`}
            foot={`กระจายใน ${new Set(by('orange').map((l) => l.clinic)).size} คลินิก`} {...jump('orange')} />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4 mb-[22px]">
        <SC c="" t="รายการยาทั้งหมด" n={fmt(new Set(rows.map((r) => r.drug.code)).size)} u="รายการ" onClick={() => go('inv', { f: 'all' })} sub={`จาก ${nClinics} คลินิก`} />
        <SC c="purple" t="รายการ Overstock" n={rows.filter((r) => r.overstock && !r.noMove).length} u="รายการ" onClick={() => go('use', { u: 'os' })} sub={`ใช้ได้เกิน ${cfg.overstockDays} วัน`} />
        <SC c="gray" t="รายการไม่เคลื่อนไหว" n={rows.filter((r) => r.noMove).length} u="รายการ" onClick={() => go('use', { u: 'nm' })} sub={`ไม่มีการจ่ายเกิน ${cfg.noMoveDays} วัน`} />
        <SC c="teal" t="มูลค่ารวมคลังยา" n={baht(total)} u="" onClick={() => go('inv', { f: 'all' })} sub={`รวม ${nClinics} คลินิก`} />
      </div>
      <div className={`${card} mb-[22px]`}>
        <div className="bg-[#e9f3fb] border-b-2 border-[#cfe0f0] px-5 py-3.5"><h3 className="text-[17px] font-semibold">ตารางวิเคราะห์และเปรียบเทียบสถานะยาประจำคลินิก</h3></div>
        <div className="overflow-auto"><table className="w-full border-separate border-spacing-0">
          <thead><tr><Th>คลินิก / สาขา</Th><Th n>รายการยา</Th>
            <Th n><i className={`${dotCls} bg-dk`} />ห้ามใช้ ส่งคืน</Th><Th n><i className={`${dotCls} bg-rd`} />แลกเปลี่ยน</Th>
            <Th n><i className={`${dotCls} bg-or`} />เฝ้าระวัง</Th><Th n>Overstock</Th><Th n>ไม่เคลื่อนไหว</Th><Th n>มูลค่ารวม</Th><Th /></tr></thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {stat.map((s) => (
              <tr key={s.c} className={`cursor-pointer ${ROW.ok}`} onClick={() => go('inv', { c: s.c, f: 'all' })}>
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 inline-grid place-items-center min-w-11 h-[34px] px-1.5 rounded-[9px] bg-[#e3edfb] text-[#2557c5] font-semibold text-[12.5px] tracking-[.02em]">{short(s.c)}</span>
                    <div><b>{s.c}</b><div className="text-xs text-mut leading-[1.3]">{BRANCH[s.c]}</div></div>
                  </div>
                </Td>
                <Td n>{s.items}</Td>
                <Td n><span className={`inline-block min-w-11 text-center rounded-lg border-2 px-3 py-[3px] text-[18px] ${s.ex ? 'bg-dk text-white border-dk font-bold' : 'bg-transparent text-[#aab3bc] border-line font-medium'}`}>{s.ex}</span></Td>
                <Td n className="text-rd font-semibold">{s.rd}</Td><Td n className="text-or font-semibold">{s.or}</Td><Td n className="text-pu font-semibold">{s.os}</Td><Td n className="text-mut2">{s.nm}</Td>
                <Td n>{baht(s.val)}</Td><Td n className="text-mut">›</Td>
              </tr>
            ))}
            <tr className="[&>td]:bg-[#e9f3fb] [&>td]:font-semibold [&>td]:border-t-2 [&>td]:border-t-[#cfe0f0]">
              <Td>รวมทั้งสิ้น ({CLINICS.length} คลินิก)</Td><Td n>{sum('items')} รายการ</Td>
              <Td n><span className="inline-block min-w-11 text-center rounded-lg border-2 px-2.5 py-0.5 text-sm bg-dk text-white border-dk font-bold">{sum('ex')} รายการ</span></Td>
              <Td n className="text-rd">{sum('rd')} รายการ</Td><Td n className="text-or">{sum('or')} รายการ</Td>
              <Td n className="text-pu">{sum('os')} รายการ</Td><Td n>{sum('nm')} รายการ</Td><Td n className="text-[19px] text-accent">{baht(sum('val'))}</Td><Td />
            </tr>
          </tbody></table></div>
      </div>
    </>
  )
}
