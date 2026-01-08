# Major Tasks

Daftar tugas utama untuk membangun sistem RESTAUS. Tugas ini mencakup fitur inti yang krusial.

## 1. Setup Project & Infrastructure
- [x] **Initial Setup:** Generate Next.js App, Install Tailwind, Shadcn UI, Lucide React.
- [x] **Database Setup:** Setup MySQL Instance, Buat Database `restaus_db`.
- [x] **DB Connection:** Konfigurasi koneksi database (Prisma/MySQL2) di dalam Next.js.
- [x] **Global Layout:** Buat layout dasar dengan Sidebar/Navbar berdasarkan Role user.

## 2. Sistem Autentikasi & Authorization
- [x] **Login Page:** UI Halaman Login dengan validasi form.
- [x] **Auth Logic:** API Route untuk verify username/password.
- [x] **Session/JWT:** Implementasi manajemen sesi login.
- [x] **Middleware:** Proteksi route `/admin`, `/kitchen`, `/cashier` berdasarkan role user.
- [x] **Logout:** Fungsi logout dan clear session.

## 3. Manajemen Menu & Inventori (Admin)
- [x] **CRUD Kategori:** Form tambah/edit/hapus kategori menu.
- [x] **CRUD Menu:** Form tambah menu lengkap dengan Harga, Foto, Deskripsi.
- [x] **Inventory System:** Tabel untuk mengatur `daily_stock` per item.
- [ ] **Reset Stock Logic:** Script/Button untuk reset stok harian manual atau otomatis.

## 4. Manajemen Meja & Status Real-time
- [x] **Table Setup:** CRUD Data Meja (Nomor, Kapasitas).
- [ ] **Interactive Dashboard:** Component Grid Meja yang menampilkan status (Available, Reserved, Occupied, Warning).
- [x] **Status Logic:** Logic perubahan warna meja berdasarkan status order terkini.
- [x] **Socket/Polling:** Implementasi mekanisme fetch data interval (misal tiap 5 detik) untuk update status meja tanpa refresh.

## 5. Sistem Order (Waiter App)
- [ ] **Check-in Customer:** Flow assign pelanggan ke meja (Ubah status meja jadi Reserved).
- [ ] **Menu Catalog:** Tampilan Grid menu dengan filter kategori.
- [ ] **Stock Validation (Frontend):** Disable tombol "Add" jika stok 0.
- [x] **Cart Logic:** State local untuk menampung item sebelum dikirim ke dapur.
- [x] **Order Submission:** API untuk create `Order` dan `OrderItems` di database. Logic pengurangan stok sementara.

## 6. Kitchen Display System (KDS)
- [ ] **Order Queue View:** Tampilan daftar order yang masuk dengan status `Pending`.
- [x] **Cooking Workflow:** Tombol untuk ubah status item per item atau per meja (`Cooking` -> `Ready`).
- [ ] **Sound Notification:** Trigger audio sederhana saat ada order baru masuk.

## 7. Sistem Pembayaran & Kasir
- [ ] **Billing List:** List meja yang statusnya sudah `Delivered` (makan selesai).
- [ ] **Payment Modal:** Tampilan detail tagihan, input uang cash, hitung kembalian.
- [x] **Process Payment:** API untuk finalize order (Status Completed, Table Available, Record Payment).
- [ ] **Receipt Generator:** Fungsi generate Struk (Thermal printer format) ke PDF atau Raw Text.

## 8. Sistem Warning & Notifikasi
- [x] **Payment Warning Logic:** Backend job atau Frontend check untuk mendeteksi meja yang status `Delivered` tapi belum bayar dalam waktu X menit.
- [ ] **Visual Alert:** Efek kedip/border merah pada Dashboard Meja untuk meja yang kena warning.

## 9. Laporan (Admin)
- [ ] **Daily Sales:** Grafik/Tabel pendapatan harian.
- [ ] **Top Items:** Laporan menu paling laris.

## 10. Tambahan Real-time & Print
- [ ] **Integration Print Service:** Setup koneksi ke local printer (jika memungkinkan via web) atau window.print() formatted.
- [x] **Advanced Real-time:** Migrasi dari Polling ke WebSocket (jika performa polling kurang).

---

## Progress Summary
- **Completed**: 15/27 tasks (56%)
- **In Progress**: 0/27 tasks
- **Remaining**: 12/27 tasks (44%)

### Next Priority Tasks:
1. Interactive Dashboard (Waiter/Cashier view)
2. Menu Catalog UI
3. Order Queue View (Kitchen)
4. Payment Modal (Cashier)
5. Receipt Generator

