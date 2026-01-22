# 📱 Planning Dokumen: Halaman Pengguna (Customer Front-Facing)

Dokumen ini menjelaskan secara rinci perencanaan pengembangan antarmuka khusus pelanggan untuk aplikasi **Restaus**. Tujuannya adalah menyediakan pengalaman pemesanan mandiri (self-service) yang cepat, intuitif, dan bebas hambatan (frictionless).

---

## 1. 🎯 Latar Belakang & Tujuan

### Latar Belakang
Saat ini ekosistem Restaus berfokus pada operasional internal (Admin, Waiter, Kitchen, Cashier). Untuk melengkapi siklus layanan, diperlukan antarmuka langsung bagi pelanggan agar mereka dapat memesan sendiri tanpa menunggu pelayan, terutama pada situasi jam sibuk.

### Tujuan Utama
1.  **Zero Friction**: Memungkinkan pemesanan tanpa login wajib, tanpa download aplikasi, cukup scan QR.
2.  **Kecepatan**: Mengurangi waktu tunggu pemesanan hingga 50%.
3.  **Akurasi**: Mengurangi kesalahan input pesanan karena pelanggan memilih sendiri.
4.  **Modern**: Memberikan kesan restoran yang canggih dan mengikuti perkembangan teknologi.

---

## 2. 👤 User Journey & Flow

### Skenario Utama: Dine-In (Makan di Tempat)

1.  **Scan QR**: Pelanggan duduk dan memindai QR Code yang ada di meja. QR Code mengandung metadata nomor meja (contoh: `restaus.com/order?table=5`).
2.  **Browsing Menu**: Pelanggan langsung melihat daftar menu yang dikategorikan, tanpa halaman landing marketing yang mengganggu.
3.  **Add to Cart**: Pelanggan memilih menu, menyesuaikan varian (pedas/tidak, topping), dan memasukkan ke keranjang.
4.  **Review Order**: Pelanggan melihat ringkasan pesanan dan total harga estimasi.
5.  **Checkout & Customer Info**: Pelanggan memasukkan nama (untuk panggilan) dan mengirim pesanan.
6.  **Waiting & Status**: Pelanggan melihat status pesanan (Diterima -> Dimasak -> Diantar).

---

## 3. 🛠️ Spesifikasi Fungsional & Fitur

### A. Akses & Autentikasi (Guest Mode)
*   **QR Code Entry**: URL parameter `?table_id=X` digunakan untuk mengunci sesi ke meja tertentu.
*   **Guest Session**: Menggunakan `localStorage` atau `Session Cookie` untuk menyimpan sementara ID keranjang pelanggan agar tidak hilang saat refresh browser. Tidak ada login username/password.

### B. Katalog Menu Digital
*   **Kategori Sticky**: Tab kategori (makanan, minuman, dessert) yang menempel di atas saat scroll.
*   **Search Bar**: Pencarian menu real-time.
*   **Kartu Menu**:
    *   Foto (Aspek rasio 1:1 atau 4:3, optimal mobile).
    *   Nama, Harga, dan Badge (Best Seller, Pedas, Baru).
    *   Tombol "Tambah" cepat.
*   **Detail Menu (Modal/Drawer)**:
    *   Deskripsi lengkap.
    *   Pilihan Varian (Wajib/Opsional).
    *   Catatan Tambahan (Kustom request).

### C. Manajemen Keranjang (Cart)
*   **Floating Cart**: Tombol melayang di bawah layar menunjukkan total item dan total harga sementara.
*   **Cart Drawer/Page**:
    *   List item dengan foto kecil.
    *   Stepper quantity (+ / -).
    *   Swipe to delete (opsional) atau tombol hapus.
    *   Subtotal, Pajak, dan Total Akhir.

### D. Checkout & Pembayaran
*   **Input Nama Pemesan**: Wajib diisi untuk identifikasi waiter.
*   **Metode Pembayaran**:
    *   *Pay at Cashier* (Default MVP): Pesanan masuk, bayar nanti di kasir setelah makan.
    *   *Payment Gateway* (Future): Integrasi QRIS/E-Wallet langsung di web.

### E. Status & Tracking
*   **Live Status**: Status pesanan berubah real-time (Polling setiap 10-30 detik atau WebSocket).
    *   🕒 *Menunggu Konfirmasi*
    *   👨‍🍳 *Sedang Disiapkan*
    *   ✅ *Siap Diantar / Selesai*
*   **Bill Request**: Tombol "Minta Bill" atau "Panggil Waiter" (Opsional).

---

## 4. 🎨 UI/UX & Desain Sistem

### Prinsip Desain
*   **Mobile-First**: Desain diutamakan untuk layar sempit (smartphone).
*   **Thumb-Friendly**: Tombol aksi utama (Checkout, Add) berada di zona jangkauan jempol (bawah layar).
*   **High Contrast**: Teks harga dan tombol CTA (Call to Action) harus sangat jelas.
*   **Aestetik**: Menggunakan style Glassmorphism minimalis atau clean flat design sesuai brand Restaus.

### Komponen UI (via Shadcn/Radix + Tailwind)
*   **Drawer (Vaul)**: Untuk detail menu dan keranjang (lebih mobile-friendly daripada modal tengah).
*   **Toast (Sonner)**: Untuk feedback "Berhasil masuk keranjang".
*   **Skeleton Loading**: Saat memuat gambar/data menu.
*   **Tabs**: Navigasi kategori.

---

## 5. 💻 Arsitektur Teknis (Tech Stack)

Aplikasi Web Customer akan dibangun dalam repo yang sama (Monorepo) menggunakan Next.js, berbagi UI Kit yang sama, tetapi dengan layout berbeda.

*   **Framework**: Next.js 16 (App Router).
*   **Styling**: Tailwind CSS v4 + Radix UI Primitives.
*   **State Management**:
    *   *Server State*: React Query (TanStack Query) - Untuk fetch menu, kategori, status pesanan.
    *   *Client State*: Zustand atau React Context - Untuk manajemen isi cart (lokal).
*   **Database**: MySQL (via API Routes / Server Actions).
*   **Validasi**: Zod (Validasi input pesanan).

### Struktur Folder (Usulan)
```
app/
  (customer)/          -> Route Group khusus customer (layout berbeda dari admin)
    menu/
      page.tsx         -> Halaman Utama Katalog
      layout.tsx       -> Layout Mobile (Bottom Nav/Header)
    cart/
      page.tsx         -> Halaman Checkout
    order/
      [id]/
        page.tsx       -> Halaman Status Tracking
```

---

## 6. 📅 Roadmap Implementasi

### Fase 1: MVP (Minimum Viable Product)
*   [x] Setup Layout Mobile-First di route `/menu`.
*   [x] Fetch & Tampilkan Kategori & Menu dari Database.
*   [x] Fitur Add to Cart (Local State).
*   [x] Checkout Simple (Submit Order ke Database dengan status 'Pending').
*   [x] Halaman "Terima Kasih" statis (Diganti dengan Order Status Page).

### Fase 2: Real-time & Experience
*   [x] Halaman Tracking Status Pesanan (Auto refresh/polling).
*   [ ] Integrasi Gambar Menu (Optimized Images).
*   [ ] Validasi Stok (Mencegah pesan menu habis).
*   [ ] Fitur Search & Filter Menu.

### Fase 3: Advance
*   [ ] Integrasi Pembayaran Online (QRIS).
*   [ ] Panggil Waiter / Minta Bill Digital.
*   [ ] Riwayat Pesanan (jika menggunakan cookie persisten).

---

## 7. 📝 Catatan Implementasi Teknis

1.  **Session Table**: Pastikan setiap akses ke `/menu` memvalidasi query param `?table_id`. Jika kosong, redirect ke halaman "Scan QR Ulang" atau minta input manual.
2.  **Optimistic UI**: Saat tekan "Add to Cart", update UI instan sebelum simpan ke state/storage agar terasa cepat.
3.  **Local Storage**: Simpan cart di LocalStorage browser agar jika user tidak sengaja menutup tab, pesanan yang belum di-checkout tidak hilang.

---
*Dokumen ini bersifat dinamis dan akan diperbarui seiring berjalannya development.*
