# RESTAUS - Project Plan & Architecture

## 1. Analisis & Tujuan Proyek
**Goal:** Membangun Sistem Point of Sales (POS) dan Manajemen Restoran berbasis web yang komprehensif, mendukung operasional real-time dari pemesanan hingga pembayaran.

**Core Philosophy:**
- **Real-time:** Status meja dan pesanan harus instan di semua device (Waiter, Kitchen, Cashier).
- **User Experience:** Interface cepat, intuitif, dan *wow factor* dengan Shadcn UI.
- **Data Integrity:** Stok harian dan status pembayaran harus akurat.

---

## 2. Tech Stack Ecosystem
- **Framework Utama:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Components) + Lucide Icons
- **Database:** MySQL
- **ORM/DB Access:** Prisma ORM (Recommended for Next.js) atau Raw SQL Drivers (mysql2)
- **State Management:** TanStack Query (React Query) - untuk caching dan sinkronisasi server state.
- **Real-time Engine:** WebSocket (via Socket.io custom server atau Supabase Realtime) atau Polling (SWR/React Query). *Rencana: Gunakan teknik polling agresif atau WebSocket untuk update status meja.*
- **PDF Generation:** `@react-pdf/renderer` atau `jspdf` untuk struk.

---

## 3. Arsitektur Sistem & Alur Data

### A. Entitas Utama (ERD Concept)
1. **Users:** Aktor sistem (Admin, Waiter, Kitchen, Cashier).
2. **Tables:** Representasi fisik meja dengan status (Available, Reserved, Occupied).
3. **Menus & Categories:** Katalog makanan/minuman.
4. **Inventories:** Stok harian yang di-reset atau di-manage per hari.
5. **Orders:** Transaksi yang sedang berlangsung. Satu meja bisa memiliki satu Order aktif.
6. **OrderItems:** Detail pesanan (Menu + Qty + Notes + Status per item).
7. **Payments:** Record pembayaran final.

### B. Flow Data Operasional
1. **Inisialisasi:** Restoran buka -> Semua meja `Available`. Inventory di-load dari master atau di-reset.
2. **Check-in:** Waiter assign Customer ke Table X -> Table status `Reserved` -> Order dibuat (Pending).
3. **Pemesanan:**
   - Waiter input item -> Cek `Inventories`.
   - Submit -> Order status `Processing`.
   - Notifikasi ke Kitchen.
4. **Dapur (Kitchen):**
   - Melihat item `Pending` / `Ordered`.
   - Ubah status item -> `Cooking` -> `Ready`.
   - Jika semua item `Ready`, Order status -> `Delivered/Served`.
5. **Billing & Warning:**
   - Order `Delivered` -> Trigger timer/warning di dashboard Kasir/Waiter.
   - User minta bill -> Kasir cetak struk sementara.
6. **Pembayaran:**
   - Kasir terima Cash -> Input ke `Payments`.
   - Order status `Completed`.
   - Table status `Available`.
   - Inventory stok berkurang permanen (jika belum dikurangi saat order). Rencana: Kurangi saat order masuk untuk hold stok.

---

## 4. Strategi UI/UX (Page Flow)
- **Login:** Simple, role-based redirection.
- **Dashboard (Map View):**
  - **Waiter/Cashier:** Grid meja dengan kode warna.
  - **Interaction:** Klik meja untuk aksi (Order/Pay).
- **Halaman Order:**
  - Sidebar: Cart/Current Order.
  - Main: Grid Menu dengan Gambar & Stock badge.
  - Modal: Detail item & Notes.
- **Kitchen View (KDS):**
  - Kanban board atau List per Meja.
  - Besar dan jelas (High contrast).
- **Cashier View:**
  - List meja yang `Served` (Priority).
  - Split/Merge bill capabilities (Future).

---

## 5. Timeline & Roadmap
1. **Foundation:** Setup Next.js, DB Schema, Auth.
2. **Core Operations:** Table Management, Menu Display, Cart Logic.
3. **Kitchen Integration:** KDS View, Status updates.
4. **Payment System:** Calculation, Receipt Printing.
5. **Real-time & Polish:** Auto-refresh, Warning systems, UI Animations.
