# Minor Tasks

Daftar tugas pendukung dan fitur spesifik untuk meningkatkan UX dan kelengkapan aplikasi.

## UX & Interface
- [ ] **Special Notes UI:** Tambahkan input text/pilihan cepat (e.g., "Less Ice", "Spicy") pada modal detail menu saat Waiter memesan.
- [ ] **Dark Mode:** Implementasi theme toggle (Next-themes + Shadcn) untuk kenyamanan mata, terutama di kondisi resto yang redup.
- [ ] **Skeleton Loading:** Tampilan loading skeleton saat data menu/tabel sedang diambil.
- [ ] **Active Link State:** Highlight menu sidebar yang sedang aktif.

## Fitur Operasional Spesifik
- [ ] **Toggle Dine-in/Take-away:** Switch pada saat pengambilan pesanan yang mempengaruhi/menandai struk.
- [ ] **Menu Search Bar:** Input pencarian di atas katalog menu untuk filter nama menu secara instan.
- [ ] **Filter Kategori Cepat:** Tabs kategori yang sticky di bagian atas katalog menu.
- [ ] **Validasi Input Stok:** Mencegah input angka negatif pada manajemen inventori.

## Manajemen Meja Lanjutan
- [ ] **Pindah Meja (Move Table):** Fitur untuk memindahkan `Order` yang sedang aktif dari Table ID A ke Table ID B.
- [ ] **Gabung Meja (Merge Table):** Fitur untuk menggabungkan tagihan dua meja menjadi satu (Logic: Merge OrderItems ke satu Order utama).

## Print & Output
- [ ] **Format Struk Bersih:** Styling CSS khusus `@media print` agar struk terlihat rapi di kertas thermal 58mm/80mm.
- [ ] **Info Struk:** Pastikan nama Waiter, Jam, Tanggal, dan No Meja tercetak jelas.
