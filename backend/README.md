# Backend (Express + PostgreSQL / Neon)

## ตั้งค่าฐานข้อมูล
1. Neon > SQL Editor > วาง sql/schema.sql แล้ว Run
2. (ถ้าต้องการข้อมูลตัวอย่าง) วาง sql/seed_sample.sql แล้ว Run

## รัน API
cp .env.example .env     # ใส่ DATABASE_URL ของ Neon
npm install
npm run dev              # http://localhost:4000/api/lots

## ก่อนใช้งานจริง
- ใส่ระบบล็อกอิน (JWT) ที่ server.js — ตอนนี้ API ยังเปิดโล่ง
- อย่าอัปโหลดไฟล์ .env ขึ้น GitHub หรือที่สาธารณะ
