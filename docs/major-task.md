# Major Tasks

Daftar tugas utama untuk membangun sistem RESTAUS. Tugas ini mencakup fitur inti yang krusial.

## 1. Setup Project & Infrastructure
- [ ] **Initial Setup:** Generate Next.js App, Install Tailwind, Shadcn UI, Lucide React.
- [ ] **Database Setup:** Setup MySQL Instance, Buat Database `restaus_db`.
- [ ] **DB Connection:** Konfigurasi koneksi database (Prisma/MySQL2) di dalam Next.js.
- [ ] **Global Layout:** Buat layout dasar dengan Sidebar/Navbar berdasarkan Role user.

## 2. Sistem Autentikasi & Authorization
- [ ] **Login Page:** UI Halaman Login dengan validasi form.
- [ ] **Auth Logic:** API Route untuk verify username/password.
- [ ] **Session/JWT:** Implementasi manajemen sesi login.
- [ ] **Middleware:** Proteksi route `/admin`, `/kitchen`, `/cashier` berdasarkan role user.
- [ ] **Logout:** Fungsi logout dan clear session.

## 3. Manajemen Menu & Inventori (Admin)
- [ ] **CRUD Kategori:** Form tambah/edit/hapus kategori menu.
- [ ] **CRUD Menu:** Form tambah menu lengkap dengan Harga, Foto, Deskripsi.
- [ ] **Inventory System:** Tabel untuk mengatur `daily_stock` per item.
- [ ] **Reset Stock Logic:** Script/Button untuk reset stok harian manual atau otomatis.

## 4. Manajemen Meja & Status Real-time
- [ ] **Table Setup:** CRUD Data Meja (Nomor, Kapasitas).
- [ ] **Interactive Dashboard:** Component Grid Meja yang menampilkan status (Available, Reserved, Occupied, Warning).
- [ ] **Status Logic:** Logic perubahan warna meja berdasarkan status order terkini.
- [ ] **Socket/Polling:** Implementasi mekanisme fetch data interval (misal tiap 5 detik) untuk update status meja tanpa refresh.

## 5. Sistem Order (Waiter App)
- [ ] **Check-in Customer:** Flow assign pelanggan ke meja (Ubah status meja jadi Reserved).
- [ ] **Menu Catalog:** Tampilan Grid menu dengan filter kategori.
- [ ] **Stock Validation (Frontend):** Disable tombol "Add" jika stok 0.
- [ ] **Cart Logic:** State local untuk menampung item sebelum dikirim ke dapur.
- [ ] **Order Submission:** API untuk create `Order` dan `OrderItems` di database. Logic pengurangan stok sementara.

## 6. Kitchen Display System (KDS)
- [ ] **Order Queue View:** Tampilan daftar order yang masuk dengan status `Pending`.
- [ ] **Cooking Workflow:** Tombol untuk ubah status item per item atau per meja (`Cooking` -> `Ready`).
- [ ] **Sound Notification:** Trigger audio sederhana saat ada order baru masuk.

## 7. Sistem Pembayaran & Kasir
- [ ] **Billing List:** List meja yang statusnya sudah `Delivered` (makan selesai).
- [ ] **Payment Modal:** Tampilan detail tagihan, input uang cash, hitung kembalian.
- [ ] **Process Payment:** API untuk finalize order (Status Completed, Table Available, Record Payment).
- [ ] **Receipt Generator:** Fungsi generate Struk (Thermal printer format) ke PDF atau Raw Text.

## 8. Sistem Warning & Notifikasi
- [ ] **Payment Warning Logic:** Backend job atau Frontend check untuk mendeteksi meja yang status `Delivered` tapi belum bayar dalam waktu X menit.
- [ ] **Visual Alert:** Efek kedip/border merah pada Dashboard Meja untuk meja yang kena warning.

## 9. Laporan (Admin)
- [ ] **Daily Sales:** Grafik/Tabel pendapatan harian.
- [ ] **Top Items:** Laporan menu paling laris.

## 10. Tambahan Real-time & Print
- [ ] **Integration Print Service:** Setup koneksi ke local printer (jika memungkinkan via web) atau window.print() formatted.
- [ ] **Advanced Real-time:** Migrasi dari Polling ke WebSocket (jika performa polling kurang).
