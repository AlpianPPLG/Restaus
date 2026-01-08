
docs
 
plan.md
 
major-task.md
 
minor-task.md
 
sql
 
query.sql
 
prompt.md
  
@docs @plan.md @major-task.md @minor-task.md @sql @query.sql 
@prompt.md  

-------------------------------------------------------------------------
Aku Mau Membuat Aplikasi Restoran, Aku Mau Kamu Membuat Planning Di Plan.md, Dan Buat Task Task Yang Banyak Di Major Task Dan Sedikit Banyak Di Minor task

Goal: Saya ingin membangun Sistem Point of Sales (POS) dan Manajemen Restoran berbasis web yang komprehensif.

Aku Mau Menggunakan Next Js + Shad Cn + Mysql Dan Lain Lain Lagi

Tech Stack:

Frontend & Framework: Next.js (App Router)

UI Component: Shadcn UI + Tailwind CSS

Database: MySQL

State Management: TanStack Query (React Query) untuk sinkronisasi data real-time.

Aku Mau Kamu Pahami Alur Kerja Bisnis Restoran Yang:
0. Waktu Restoran Buka Semua Meja Mempunyai Status Avaliable
1. Pelanggan Masuk
2. Waiter Mendatangi Pelanggan Mengubah Status Meja Menjadi Booking Atau Reservasi
3. Pelanggan Memilih Menu Dari Jenis Makanan Berat, Minuman, Hingga Dessert
4. Lalu Status Bisa Di Tambah Sedang Di Olah
5. Jika Sudah Di Olah Maka Status Bisa Di Ubah Ke Sudah Diantar
6. Lalu Setelah Pelanggan Sudah Makan Lalu Melakukan Pembayaran Cash
7. Ada Warning Setelah Makanan Sudah Sampai Maka Akan Ada Warning Untuk Meja Nomor Yang Di Booking Untuk Membayar Cash

-------------------------------------------------------------------------
Buat Query Query Yang Lengkap Minimal 8 Table Dengan Kolomn Kolom Yang Sangat Lengkap Dan Tipe Data Yang Sesuai,Ada Relasi Pada Table-Table

Dan Lain Lain

-------------------------------------------------------------------------
1. Dokumentasi & Task Management
Tolong buatkan struktur file berikut:

Plan.md: Berisi arsitektur aplikasi, skema alur data (ERD penjelasan), dan strategi implementasi.

Major Tasks: (Dibuat secara detail dan banyak)

Setup Project & Database Migration.

Sistem Autentikasi & Multi-role (Admin, Waiter, Kasir, Kitchen).

Manajemen Inventori & Menu (Daily Stock Update).

Logika Reservasi & Manajemen Status Meja Real-time.

Sistem Order & Integrasi Kitchen Display System (KDS).

Modul Pembayaran & Generate Struk (PDF/Thermal).

Sistem Notifikasi Warning Pembayaran Otomatis.

Minor Tasks: (Dibuat spesifik)

Fitur "Special Notes" per item menu.

Toggle Dine-in / Take-away.

Filter kategori menu.

Dark mode/Light mode UI.

Validasi input stok minimum.

2. Alur Kerja Bisnis (Business Logic)
Pahami dan implementasikan alur berikut secara ketat: 0. Inisialisasi: Saat sistem dimulai/restoran buka, semua meja otomatis berstatus Available.

Customer Arrival: Pelanggan datang, Waiter memilih meja di sistem.

Table Locking: Status meja berubah: Available -> Occupied/Reserved.

Ordering: Pelanggan memilih Menu (Makanan Berat, Minuman, Dessert).

Fitur Tambahan: Cek ketersediaan porsi harian secara real-time. Jika habis, menu otomatis disabled.

Production: Order dikirim ke dapur. Status: Pending -> Processing (Sedang Diolah).

Delivery: Setelah selesai, status berubah: Ready to Serve -> Delivered (Sudah Diantar).

Warning System: Setelah status berubah menjadi Delivered, sistem akan memicu Warning (notifikasi/highlight warna) pada meja tersebut sebagai pengingat bahwa tagihan siap dibayar.

Payment: Pelanggan membayar Cash. Kasir memproses, status meja kembali ke Available, dan stok porsi berkurang.

3. Skema Database (MySQL Query)
Buatlah minimal 8 table dengan relasi yang kuat (Foreign Keys, Indexes, Enums):

users: (id, username, password, role [admin, waiter, kitchen, cashier])

tables: (id, table_number, capacity, status [available, reserved, occupied])

categories: (id, name [food, drink, dessert])

menus: (id, category_id, name, description, price, image_url, is_active)

inventories: (id, menu_id, daily_stock, remaining_stock, last_updated)

orders: (id, table_id, user_id (waiter), order_type [dine_in, take_away], total_price, status [pending, processing, delivered, completed, cancelled], created_at)

order_items: (id, order_id, menu_id, quantity, special_notes, subtotal)

payments: (id, order_id, payment_method [cash], amount_paid, change_amount, transaction_date)

4. Fitur Spesifik & Output
Fitur Utama:

Bayar di Akhir: Transaksi tetap terbuka hingga proses pembayaran cash selesai.

Dine-in / Take-away: Pembedaan skema pelayanan di struk.

Special Notes: Catatan seperti "Tanpa selada" atau "Es batu sedikit".

Real-time Table Status: Dashboard yang menunjukkan meja mana yang sedang makan, mana yang menunggu makanan, dan mana yang sudah selesai makan tapi belum bayar.

Output Struk (Final Result):

Harus mencakup: Nama Restoran, No Meja, Nama Waiter, List Menu (Qty, Harga, Notes), Subtotal, Pajak/Service (jika ada), Total, Jumlah Bayar (Cash), dan Kembalian.

Format harus bersih dan siap cetak untuk menghindari miskomunikasi antara dapur, pelayan, dan pelanggan.

-------------------------------------------------------------------------

Alur Halaman Aplikasi (Page Flow)
1. Halaman Autentikasi (Login)
Halaman Login: Input username dan password.

Role Redirect: Sistem mendeteksi role (Admin/Waiter/Kitchen/Cashier) dan mengarahkan ke dashboard yang sesuai.

2. Halaman Dashboard Utama (Waiter & Cashier)
Halaman ini adalah representasi visual dari denah restoran.

Layout Meja (Grid System): Menampilkan semua nomor meja.

Indikator Warna Status Meja:

Hijau (Available): Meja kosong.

Kuning (Reserved/Booking): Pelanggan baru duduk, pesanan sedang diproses.

Biru (Processing): Pesanan sedang dimasak di dapur.

Merah Kedip/Border Bold (Warning/Payment Needed): Makanan sudah sampai semua, pelanggan siap bayar.

Fitur Klik Meja: Klik meja kosong untuk memulai pesanan baru.

3. Halaman Pemesanan (Order Page - Waiter)
Halaman ini muncul setelah waiter memilih meja yang tersedia.

Pilih Tipe: Toggle Dine-in atau Take-away.

Katalog Menu: Terbagi menjadi tab kategori: Makanan Berat, Minuman, Dessert.

Update Stok Harian: Menu yang stoknya 0 (berdasarkan tabel inventories) akan otomatis abu-abu (disabled).

Custom Notes: Popup untuk setiap item (Contoh: "Tanpa pedas", "Es batu pisah").

Ringkasan Pesanan (Sidebar): Menampilkan daftar pesanan sementara sebelum dikirim ke database.

Tombol "Kirim ke Dapur": Mengubah status meja menjadi Reserved dan status pesanan menjadi Processing.

4. Halaman Dapur (Kitchen Display System - Kitchen)
Halaman khusus untuk staf dapur.

Antrean Pesanan (Queue): Card yang berisi List Menu per nomor meja.

Tombol Status:

Tombol "Masak": Mengubah status item menjadi In Progress.

Tombol "Selesai": Mengubah status menjadi Ready to Serve.

Notifikasi: Suara "Beep" setiap ada pesanan baru masuk.

5. Halaman Kasir & Pembayaran (Cashier)
List Meja Aktif: Menampilkan meja yang sudah berstatus Delivered.

Sistem Warning: Meja yang semua makanannya sudah terkirim akan muncul di paling atas dengan tanda peringatan (sesuai poin 7 di alurmu).

Detail Transaksi: Menampilkan rincian pesanan, total harga, dan pajak.

Modal Pembayaran Cash:

Input nominal uang diterima.

Kalkulator otomatis untuk kembalian.

Tombol "Selesaikan & Cetak": Mencetak struk fisik, mengubah status meja kembali ke Available, dan mencatat data ke tabel payments.

6. Halaman Manajemen Admin (Back-office)
Dashboard Statistik: Grafik pendapatan harian dan menu paling laris.

Manajemen Menu: Tambah/Edit/Hapus menu dan kategori.

Manajemen Stok: Update porsi harian (Daily Stock Update).

Laporan Transaksi: Filter history pembayaran berdasarkan tanggal.

Task Baru untuk Plan.md
Major Tasks (Tambahan):

Implementasi Real-time Updates menggunakan WebSocket atau Supabase Realtime agar status meja berubah di semua layar tanpa refresh.

Logic Warning Timer: Trigger warna merah pada meja jika status pesanan sudah Delivered lebih dari 5 menit tapi belum dibayar.

Integrasi Print Service: Setup fungsi cetak struk otomatis ke printer thermal.

Minor Tasks (Tambahan):

Fitur "Pindah Meja": Memindahkan pesanan dari meja 1 ke meja 5.

Fitur "Gabung Meja": Menggabungkan dua tagihan meja menjadi satu.

Search bar di halaman menu untuk mempercepat pencarian item.

-------------------------------------------------------------------------
Di Bawah Ini Adalah Sekedar Contoh Fitur Fitur Yang Akan Ada:

bayar diakhir
dine in / take away
ada catatan khusus
ketersedaiaan meja
menu porsi terupdate harian

output: struk menu yang lengkap agar tidak ada miss komunikasi

pembayaran: cash
-------------------------------------------------------------------------
CATATAN KAKI PENTING: BELUM CODING, HANYA PLANNING