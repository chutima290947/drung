npm install && npm run dev

สไตล์ทั้งหมดใช้ Tailwind CSS v4 (@tailwindcss/vite) — โทเคนสีอยู่ใน src/styles.css (@theme), class ที่ใช้ซ้ำอยู่ใน src/classes.js

src/
  App.jsx                  state + คำนวณข้อมูล + layout (ส่งข้อมูลให้ทุกหน้าผ่าน prop `d`)
  data.js                  ข้อมูลตัวอย่าง / Drug master (แทนด้วย API ภายหลัง)
  utils.js                 สูตรคำนวณ Exp / สรุปรายยา + ตัวช่วยจัดรูปแบบ
  pages/
    DashboardPage.jsx      ภาพรวม
    InventoryPage.jsx      คลังยา / Lot
    UsagePage.jsx          การใช้ยา
    AlertsPage.jsx         แจ้งเตือน
  components/
    Sidebar.jsx  TopBar.jsx  Drawer.jsx  AddItemModal.jsx  SettingsModal.jsx
    ui.jsx                 Pill, Flags, Chips, SC (ชิ้นส่วนที่ใช้ซ้ำ)