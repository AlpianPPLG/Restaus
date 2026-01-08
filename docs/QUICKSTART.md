# 🚀 RESTAUS - Quick Start Guide

Panduan cepat untuk menjalankan aplikasi RESTAUS dalam 5 menit!

## ⚡ Prerequisites

Pastikan sudah terinstall:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ MySQL 8+ ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ Git (optional)

## 📦 Step 1: Install Dependencies

```bash
cd restaus-app
npm install
```

**Estimasi waktu**: ~2 menit

## 🗄️ Step 2: Setup Database

### 2.1 Buat Database

Buka MySQL command line atau MySQL Workbench, lalu jalankan:

```bash
mysql -u root -p
```

Kemudian jalankan file schema:

```bash
mysql -u root -p < sql/query.sql
```

Atau copy-paste isi file `sql/query.sql` ke MySQL Workbench.

### 2.2 Insert Seed Data

```bash
mysql -u root -p < sql/seed.sql
```

Atau copy-paste isi file `sql/seed.sql` ke MySQL Workbench.

**Estimasi waktu**: ~1 menit

## ⚙️ Step 3: Configure Environment

Buat file `.env.local` di root folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=restaus_db
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**⚠️ PENTING**: Ganti `your_mysql_password` dengan password MySQL Anda!

**Estimasi waktu**: ~30 detik

## 🎯 Step 4: Run Application

```bash
npm run dev
```

Tunggu hingga muncul pesan:

```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

**Estimasi waktu**: ~30 detik

## 🔓 Step 5: Login

Buka browser dan akses: **http://localhost:3000**

Anda akan diarahkan ke halaman login. Gunakan salah satu kredensial berikut:

### 👨‍💼 Admin
```
Username: admin
Password: admin123
```
**Akses**: Dashboard admin, manajemen menu, laporan

### 👨‍🍳 Waiter
```
Username: waiter
Password: waiter123
```
**Akses**: Dashboard meja, pemesanan

### 🧑‍🍳 Kitchen
```
Username: kitchen
Password: kitchen123
```
**Akses**: Antrean pesanan dapur

### 💰 Cashier
```
Username: cashier
Password: cashier123
```
**Akses**: Pembayaran dan struk

## ✅ Verification

Setelah login, Anda akan diarahkan ke dashboard sesuai role:

- **Admin** → `/admin` (Dashboard & Menu Management)
- **Waiter** → `/waiter` (Table Dashboard)
- **Kitchen** → `/kitchen` (Order Queue)
- **Cashier** → `/cashier` (Payment Processing)

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
**Solusi**:
1. Pastikan MySQL service sudah running
2. Cek kredensial di `.env.local`
3. Pastikan database `restaus_db` sudah dibuat

```bash
# Cek MySQL service (Windows)
net start MySQL80

# Cek MySQL service (Mac/Linux)
sudo systemctl status mysql
```

### Error: "Port 3000 already in use"
**Solusi**:
```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### Error: "Module not found"
**Solusi**:
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database seed error
**Solusi**:
```bash
# Drop dan recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS restaus_db;"
mysql -u root -p < sql/query.sql
mysql -u root -p < sql/seed.sql
```

## 📚 Next Steps

Setelah aplikasi berjalan:

1. **Eksplorasi Fitur**
   - Login sebagai Waiter dan coba buat order
   - Login sebagai Kitchen dan lihat order queue
   - Login sebagai Cashier dan proses pembayaran

2. **Baca Dokumentasi**
   - [README.md](../README.md) - Overview lengkap
   - [docs/plan.md](./plan.md) - Arsitektur sistem
   - [docs/major-task.md](./major-task.md) - Daftar fitur

3. **Development**
   - Lihat [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) untuk progress
   - Cek [PROGRESS.md](./PROGRESS.md) untuk next steps

## 🎨 Demo Data

Aplikasi sudah include demo data:

- **10 Meja**: T01 - T10 dengan berbagai kapasitas
- **13 Menu Items**: Makanan, Minuman, Dessert
- **4 Users**: Admin, Waiter, Kitchen, Cashier
- **Sample Order**: 1 completed order untuk testing

## 💡 Tips

1. **Real-time Updates**: Dashboard akan auto-refresh setiap 3-5 detik
2. **Dark Mode**: Klik icon moon/sun di navbar (coming soon)
3. **Responsive**: Buka di mobile untuk melihat responsive design
4. **Dev Tools**: React Query DevTools tersedia di development mode

## 🔗 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
mysql -u root -p restaus_db < sql/query.sql   # Reset schema
mysql -u root -p restaus_db < sql/seed.sql    # Reset data
```

## 📞 Need Help?

- Check [README.md](../README.md) untuk dokumentasi lengkap
- Lihat [docs/](.) folder untuk dokumentasi detail
- Review code di `app/api/` untuk API endpoints

---

**Total Setup Time**: ~5 menit ⚡

Selamat mencoba RESTAUS! 🍽️
