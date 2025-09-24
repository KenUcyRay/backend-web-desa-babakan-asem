# Update CallCenter Model - Icon & Color Fields

## Perubahan yang Telah Dilakukan

### 1. Schema Database (Prisma)
✅ **File**: `prisma/schema.prisma`
- Menambahkan field `icon String? @db.VarChar(50)` 
- Menambahkan field `color String? @db.VarChar(50)`
- Field bersifat optional (nullable) untuk backward compatibility

### 2. Migration Database
✅ **File**: `prisma/migrations/20250101000000_add_icon_color_to_callcenter/migration.sql`
- Migration berhasil diapply ke database
- Menambahkan kolom `icon` dan `color` ke tabel `callcenters`

### 3. Model TypeScript
✅ **File**: `src/model/callcenter-model.ts`
- Update interface `CreateCallCenterRequest`
- Menambahkan field `icon?: string` dan `color?: string`

### 4. Validation Schema
✅ **File**: `src/validation/callcenter-validation.ts`
- Update validation untuk `create` dan `update`
- Menambahkan validasi untuk field `icon` dan `color` (max 50 karakter, optional)

### 5. Service Layer
✅ **File**: `src/service/callcenter-service.ts`
- Update method `create()` untuk menyimpan field `icon` dan `color`
- Field akan otomatis ter-handle di method `update()` karena menggunakan spread operator

### 6. API Endpoints
✅ **Routes sudah ada**:
- `POST /admin/callcenters` - Untuk create (admin)
- `PUT /admin/callcenters/:id` - Untuk update (admin)  
- `GET /callcenters` - Untuk public (mengembalikan semua field termasuk icon & color)
- `GET /admin/callcenters` - Untuk admin (mengembalikan semua field)

## Contoh Request & Response

### POST /admin/callcenters
```json
{
  "name": "Customer Service",
  "type": "CALL_CENTER",
  "number": "08123456789",
  "icon": "customer_service",
  "color": "text-blue-500",
  "is_active": true
}
```

### PUT /admin/callcenters/:id
```json
{
  "name": "Customer Service Updated",
  "icon": "support",
  "color": "text-green-500"
}
```

### GET /callcenters (Public Response)
```json
{
  "page": 1,
  "limit": 10,
  "total_page": 1,
  "total_items": 1,
  "data": [
    {
      "id": "uuid",
      "name": "Customer Service",
      "type": "CALL_CENTER",
      "number": "08123456789",
      "icon": "customer_service",
      "color": "text-blue-500",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Icon Keys yang Didukung
- `customer_service`
- `admin`
- `hospital`
- `police`
- `support`
- `phone`
- `whatsapp`

## Color Classes yang Didukung
- `text-blue-500`
- `text-purple-500`
- `text-red-500`
- `text-green-500`
- `text-yellow-500`
- dll (semua Tailwind CSS color classes)

## Status
✅ **SELESAI** - Semua perubahan telah diimplementasi dan siap digunakan.

## Catatan
- Field `icon` dan `color` bersifat optional untuk menjaga backward compatibility
- Validation membatasi panjang maksimal 50 karakter untuk kedua field
- API endpoints yang sudah ada akan otomatis mengembalikan field baru ini