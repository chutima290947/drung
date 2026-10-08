import { fmt, baht, thDate, dayTxt } from '../utils.js'
import { Pill, Flags, Chips, SC, Th, Td } from '../components/ui.jsx'
import { card, ROW, noteInput } from '../classes.js'

export default function InventoryPage({ d }) {
  const { cfg, lotRows, cnt, qty, val, fs, setFs, rowMap, notes, setNotes, setSel, del } = d
  const invRows = fs === 'all' ? lotRows : lotRows.filter((l) => l.status === fs)
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4 mb-[22px]">
        <SC c="dk" t="หมดอายุห้ามใช้" n={cnt('expired')} u={`Lot (${fmt(qty('expired'))} หน่วย)`} sub={`รวมมูลค่า ${baht(val('expired'))}`} onClick={() => setFs(fs === 'expired' ? 'all' : 'expired')} />
        <SC c="rd" t={`ใกล้หมดอายุ (≤ ${cfg.redMonths} เดือน)`} n={cnt('red')} u="Lots" sub={`รวมมูลค่า ${baht(val('red'))}`} onClick={() => setFs(fs === 'red' ? 'all' : 'red')} />
        <SC c="or" t={`เฝ้าระวัง (≤ ${cfg.orangeMonths} เดือน)`} n={cnt('orange')} u={`Lot (${fmt(qty('orange'))} หน่วย)`} sub={`รวมมูลค่า ${baht(val('orange'))}`} onClick={() => setFs(fs === 'orange' ? 'all' : 'orange')} />
        <SC c="teal2" t="ปกติ (ระยะปลอดภัย)" n={cnt('ok')} u={`Lots (${fmt(qty('ok'))} หน่วย)`} sub={`รวมมูลค่า ${baht(val('ok'))}`} onClick={() => setFs(fs === 'ok' ? 'all' : 'ok')} />
      </div>
      <Chips v={fs} set={setFs} items={[['all', `ทั้งหมด (${lotRows.length})`], ['expired', `หมดอายุห้ามใช้ (${cnt('expired')})`], ['red', `ใกล้หมดอายุ (${cnt('red')})`], ['orange', `เฝ้าระวัง (${cnt('orange')})`], ['ok', `ปกติ (${cnt('ok')})`]]} />
      <div className={`${card} overflow-auto`}>
        <table className="w-full border-separate border-spacing-0">
          <thead><tr><Th>รหัสยา</Th><Th>ยา</Th><Th>คลินิก</Th><Th>Lot</Th><Th n>คงเหลือ</Th><Th n>มูลค่า</Th><Th>Exp</Th><Th n>เหลือ</Th><Th>สถานะ Exp</Th><Th>สถานะการใช้</Th><Th>หมายเหตุ</Th><Th /></tr></thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {invRows.map((l) => {
              const nk = `${l.clinic}|${l.lot}`, r = rowMap[l.key]
              return (
                <tr key={nk} className={`cursor-pointer ${ROW[l.status]}`} onClick={() => setSel(l.key)}>
                  <Td className="text-mut">{l.code}</Td><Td>{l.drug.name}</Td><Td>{l.clinic}</Td><Td>{l.lot}</Td>
                  <Td n>{fmt(l.qty)} {l.drug.unit}</Td><Td n>{baht(l.qty * l.drug.price)}</Td>
                  <Td className="font-bold text-[15.5px]">{thDate(l.exp)}</Td><Td n className="font-bold text-[15.5px]">{dayTxt(l.exp)}</Td><Td><Pill s={l.status} /></Td>
                  <Td>{r.noMove || r.overstock || r.low ? <Flags r={r} /> : <span className="text-mut">ปกติ</span>}</Td>
                  <Td onClick={(e) => e.stopPropagation()}><input className={noteInput} placeholder="+ หมายเหตุ" value={notes[nk] || ''} onChange={(e) => setNotes({ ...notes, [nk]: e.target.value })} /></Td>
                  <Td onClick={(e) => e.stopPropagation()}><button className="border-0 bg-transparent px-2 py-1 text-inherit opacity-55 hover:opacity-100 cursor-pointer" onClick={() => del(l)} aria-label="ลบ">✕</button></Td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-line text-[13px] text-mut">แสดง <b className="text-ink">{invRows.length}</b> รายการ · มูลค่ารวม <b className="text-ink">{baht(invRows.reduce((a, l) => a + l.qty * l.drug.price, 0))}</b> · คลิกที่แถวเพื่อดูรายละเอียด</div>
      </div>
    </>
  )
}