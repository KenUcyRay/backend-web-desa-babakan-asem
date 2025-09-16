# Regulation Management API

This document describes the regulation management system endpoints and functionality.

## Features

- JWT authentication for admin operations
- PDF file upload with validation (max 10MB)
- CRUD operations for regulations
- Public access for viewing and downloading regulations
- File serving with proper security

## API Endpoints

### Authentication
- `POST /api/users/login` - Admin login
- `POST /api/users/register` - Create admin (first time setup)

### Public Endpoints
- `GET /api/regulations` - Get all regulations
- `GET /api/regulations/:id/download` - Download PDF file

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/regulations` - Upload regulation (with PDF file)
- `PUT /api/admin/regulations/:id` - Update regulation (optional new PDF)
- `DELETE /api/admin/regulations/:id` - Delete regulation and file

## Request/Response Format

### Create Regulation
```bash
POST /api/admin/regulations
Content-Type: multipart/form-data

Fields:
- title: string (required)
- year: number (required)
- file: PDF file (required, max 10MB)
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    "id": 1,
    "title": "Peraturan Desa No. 1 Tahun 2024",
    "year": 2024,
    "filePath": "/uploads/regulations/1234567890_regulation.pdf",
    "fileName": "peraturan_desa.pdf",
    "fileSize": "1048576",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## File Upload Requirements

- **File Type**: Only PDF files (.pdf)
- **Max Size**: 10MB
- **Storage**: `/uploads/regulations/`
- **Naming**: `{randomHash}-{timestamp}.pdf`
- **Access**: Files served via `/api/public/regulations/` endpoint

## Authentication

Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "errors": "Error message"
}
```

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run migrate          # Run migrations
npm run migrate:deploy   # Deploy migrations (production)
npm run generate        # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio
```

## Environment Variables

Required environment variables in `.env`:
```
DATABASE_URL=mysql://user:password@localhost:3306/database_name
PORT=3001
JWT_SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
```