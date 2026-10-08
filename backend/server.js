require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// TODO: ใส่ middleware ล็อกอิน (เช่น JWT ของ pharmatrack) ก่อนใช้งานจริง
// app.use('/api', require('./middleware/auth'))

const wrap = (fn) => (req, res) => fn(req, res).catch((e) => { console.error(e); res.status(500).json({ error: e.message }) })

// ดึงชื่อ/หน่วย/ราคา จากรหัสยา (หน้า เพิ่มรายการเวชภัณฑ์)
app.get('/api/drugs/:code', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT code, name, unit, unit_price FROM drugs WHERE code = upper($1) AND active', [req.params.code])
  rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'ไม่พบรหัสยา' })
}))

app.get('/api/clinics', wrap(async (_req, res) => {
  res.json((await pool.query('SELECT code, name, location_th FROM clinics WHERE active ORDER BY code')).rows)
}))

// Lot ทั้งหมดพร้อมสถานะ Exp ที่คำนวณแล้ว
app.get('/api/lots', wrap(async (_req, res) => {
  res.json((await pool.query('SELECT * FROM v_lots ORDER BY expiry_date')).rows)
}))

// เพิ่ม Lot ใหม่ + บันทึก movement "receive"
app.post('/api/lots', wrap(async (req, res) => {
  const { clinic, code, lot, qty, exp } = req.body
  if (!clinic || !code || !lot || !(qty > 0) || !exp) return res.status(400).json({ error: 'ข้อมูลไม่ครบ' })
  const c = await pool.connect()
  try {
    await c.query('BEGIN')
    const { rows } = await c.query(
      `INSERT INTO drug_lots (clinic_code, drug_code, lot_no, qty, expiry_date) VALUES ($1, upper($2), $3, $4, $5) RETURNING id`,
      [clinic, code, lot, qty, exp])
    await c.query(`INSERT INTO stock_movements (clinic_code, drug_code, lot_id, movement_type, qty) VALUES ($1, upper($2), $3, 'receive', $4)`,
      [clinic, code, rows[0].id, qty])
    await c.query('COMMIT')
    res.status(201).json({ id: rows[0].id })
  } catch (e) {
    await c.query('ROLLBACK')
    res.status(e.code === '23505' ? 409 : e.code === '23503' ? 400 : 500).json({ error: e.code === '23505' ? 'Lot นี้มีอยู่แล้ว' : e.message })
  } finally { c.release() }
}))

app.delete('/api/lots/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM drug_lots WHERE id = $1', [req.params.id])
  res.status(204).end()
}))

// สรุปต่อ ยา+คลินิก (คงเหลือ + ยอดจ่าย 30/90/180 วัน)
app.get('/api/usage', wrap(async (_req, res) => {
  res.json((await pool.query('SELECT * FROM v_usage')).rows)
}))

// หมายเหตุ
app.put('/api/notes/lot/:id', wrap(async (req, res) => {
  const note = (req.body.note || '').trim()
  if (!note) await pool.query('DELETE FROM lot_notes WHERE lot_id = $1', [req.params.id])
  else await pool.query(`INSERT INTO lot_notes (lot_id, note) VALUES ($1, $2)
    ON CONFLICT (lot_id) DO UPDATE SET note = EXCLUDED.note, updated_at = now()`, [req.params.id, note])
  res.status(204).end()
}))
app.put('/api/notes/drug/:clinic/:drug', wrap(async (req, res) => {
  const note = (req.body.note || '').trim()
  if (!note) await pool.query('DELETE FROM drug_notes WHERE clinic_code = $1 AND drug_code = $2', [req.params.clinic, req.params.drug])
  else await pool.query(`INSERT INTO drug_notes (clinic_code, drug_code, note) VALUES ($1, $2, $3)
    ON CONFLICT (clinic_code, drug_code) DO UPDATE SET note = EXCLUDED.note, updated_at = now()`, [req.params.clinic, req.params.drug, note])
  res.status(204).end()
}))

// ค่าตั้งเกณฑ์
app.get('/api/settings', wrap(async (_req, res) => {
  res.json((await pool.query(`SELECT value FROM app_settings WHERE key = 'thresholds'`)).rows[0].value)
}))
app.put('/api/settings', wrap(async (req, res) => {
  await pool.query(`INSERT INTO app_settings (key, value) VALUES ('thresholds', $1)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`, [req.body])
  res.status(204).end()
}))

app.listen(process.env.PORT || 4000, () => console.log('API on port', process.env.PORT || 4000))
