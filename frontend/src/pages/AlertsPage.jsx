import { fmt, baht, thDate, dayTxt, cov, EXP_LABEL } from '../utils.js'
import { pillCls } from '../classes.js'

export default function AlertsPage({ d }) {
  const { cfg, rows, by, setSel } = d
  const lotItems = (s) => by(s).map((l) => ({
    key: l.key, name: l.drug.name, value: l.qty * l.drug.price,
    meta: `${l.clinic} · ${l.lot} · ${fmt(l.qty)} ${l.drug.unit} · Exp ${thDate(l.exp)} (เหลือ ${dayTxt(l.exp)})`,
  }))
  const rowItems = (f) => rows.filter(f).map((r) => ({
    key: r.key, name: r.drug.name, value: r.value,
    meta: `${r.clinic} · คงเหลือ ${fmt(r.stock)} · ใช้ ${fmt(r.avg, 2)}/วัน · ใช้ได้อีก ${cov(r.coverage)}`,
  }))
  const groups = [
    [EXP_LABEL.expired, 'expired', lotItems('expired')],
    [`${EXP_LABEL.red} (≤ ${cfg.redMonths} เดือน)`, 'red', lotItems('red')],
    [`เฝ้าระวัง (≤ ${cfg.orangeMonths} เดือน)`, 'orange', lotItems('orange')],
    ['Overstock', 'over', rowItems((r) => r.overstock && !r.noMove)],
    ['ไม่เคลื่อนไหว', 'nomove', rowItems((r) => r.noMove)],
    ['ใกล้หมด', 'low', rowItems((r) => r.low)],
  ]
  const Group = ([t, c, items]) => (
    <details key={t} className="group bg-white rounded-[14px] shadow-card px-5 py-3.5" open={(c === 'expired' || c === 'red') && items.length > 0}>
      <summary className="cursor-pointer font-medium flex items-center gap-2.5 list-none [&::-webkit-details-marker]:hidden after:content-['›'] after:text-mut after:text-xl after:transition-transform after:duration-150 group-open:after:rotate-90">
        <span className={pillCls(c, { solid: true })}>{items.length}</span> {t}
        <span className="ml-auto mr-3.5 text-mut text-[13.5px] font-normal">{baht(items.reduce((a, i) => a + i.value, 0))}</span>
      </summary>
      <ul className="mt-3 mb-0.5 p-0 list-none grid gap-0.5">
        {items.slice(0, 40).map((i, k) => (
          <li key={i.key + k} onClick={() => setSel(i.key)} className="flex flex-col cursor-pointer px-3 py-[7px] rounded-lg text-sm odd:bg-head hover:bg-accent-soft">
            <b>{i.name}</b><span className="text-mut text-[13px]">{i.meta}</span>
          </li>
        ))}
      </ul>
    </details>
  )

  return <div className="grid gap-3">{groups.map(Group)}</div>
}
