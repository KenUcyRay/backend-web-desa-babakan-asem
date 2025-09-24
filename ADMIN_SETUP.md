# Admin Setup Guide

## Setelah Migration Reset

Jika Anda melakukan `prisma migrate reset`, semua data termasuk akun admin akan hilang.

### Cara Membuat Akun Admin Lagi:

```bash
npx ts-node src/seeder/admin-seeder.ts
```

### Kredensial Admin Default:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

### ⚠️ PENTING:
- Ganti password setelah login pertama
- Seeder akan menghapus admin yang sudah ada dan membuat yang baru
- Pastikan database sudah running sebelum menjalankan seeder

### Alternatif Cara Menjalankan Seeder:
```bash
# Jika ada masalah dengan ts-node
npm run build
node dist/seeder/admin-seeder.js

# Atau langsung compile dan run
npx tsc && node dist/seeder/admin-seeder.js
```

### Troubleshooting:
- Jika error "ts-node not found": `npm install -g ts-node`
- Jika error database connection: Cek file `.env` dan pastikan MySQL running
- Jika error permission: Jalankan terminal sebagai administrator