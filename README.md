# Company Importer App

A Node.js/Express backend for importing company data from `.xlsx` or `.csv` files, supporting multiple import modes. Designed for use with a React frontend.

## Features

- Upload `.xlsx` or `.csv` files containing company data.
- Five import modes:
  1. **Create New Companies**: Insert only new companies (skip existing).
  2. **Create New & Update Existing (No Overwrite)**: Insert new, update only empty fields for existing.
  3. **Create New & Update Existing (Overwrite)**: Insert new, overwrite all fields for existing.
  4. **Update Only Existing (No Overwrite)**: Update only empty fields for existing companies.
  5. **Update Only Existing (Overwrite)**: Overwrite all fields for existing companies.
- Email is used as the unique identifier.
- Returns a summary of inserted, updated, and skipped records.
- Rate limiting, CORS, logging, and error handling included.

## Technologies

- Node.js, Express
- MongoDB (via Mongoose)
- Multer (file uploads)
- xlsx (file parsing)
- express-validator (validation)
- Winston & Morgan (logging)

## API Endpoints

### Healthcheck

```
GET /api/v1/healthcheck
```

### Import Companies

```
POST /api/v1/import-xl-csv
```

**Form Data:**
- `file`: The `.xlsx` or `.csv` file (required)
- `mode`: Import mode (1-5, required)

**Response Example:**
```json
{
  "status": "success",
  "inserted": 8,
  "updated": 4,
  "skipped": 2
}
```

## Company Schema

```json
{
  "name": "OpenAI",
  "industry": "AI Research",
  "location": "San Francisco",
  "email": "contact@openai.com",
  "phone": "1234567890"
}
```
- `email` is unique and required.
- Other fields are optional.

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```
   npm install
   ```
3. **Configure environment variables**
   - Create a `.env` file with:
     ```
     MONGODB_URI=mongodb://localhost:27017
     CORS_ORIGIN=http://localhost:3000
     ```
4. **Start the server**
   ```
   npm run dev
   ```

## Notes

- Make sure MongoDB is running.
- The frontend should POST files to `/api/v1/import-xl-csv` with the correct `mode`.
- See `src/models/company.model.js` for the full schema.

---

**License:** MIT
