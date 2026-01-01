# Backend Setup Guide

This guide will help you set up and run the backend API for the Tip Calculator application.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp env .env
```

Or manually create `.env` with:

```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/tip_calculator.db
CORS_ORIGIN=http://localhost:8080
```

### 3. Start the Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 4. Verify Backend is Running

Open your browser and visit:
- Health check: http://localhost:3001/health

You should see:
```json
{
  "status": "ok",
  "message": "Tip Calculator API is running",
  "timestamp": "2024-12-30T..."
}
```

## Frontend Integration

### 1. Update Frontend Environment Variables

Create or update `.env` in the project root:

```env
VITE_API_URL=http://localhost:3001
```

### 2. Update TipCalculator Component

The frontend API utility is already created at `src/lib/api.ts`. You can now use it in your components:

```typescript
import { calculateTip, getHistory } from '@/lib/api';

// Example usage in TipCalculator component
const handleCalculate = async () => {
  try {
    const result = await calculateTip({
      billAmount: parseFloat(billAmount),
      tipPercent: getCurrentTip()!,
      numberOfPeople: parseInt(numberOfPeople)
    });
    
    setResults({
      tipAmount: result.tipAmount,
      totalWithTip: result.totalWithTip,
      amountPerPerson: result.amountPerPerson
    });
  } catch (error) {
    console.error('Calculation error:', error);
  }
};
```

## API Endpoints

### Calculations

- **POST** `/api/calculations`
  - Calculate tip and save to history
  - Body: `{ billAmount, tipPercent, numberOfPeople }`
  - Returns: `{ tipAmount, totalWithTip, amountPerPerson, calculationId }`

- **POST** `/api/calculations/validate`
  - Validate calculation without saving
  - Body: `{ billAmount, tipPercent, numberOfPeople }`
  - Returns: `{ tipAmount, totalWithTip, amountPerPerson }`

### History

- **GET** `/api/history?limit=50&offset=0`
  - Get calculation history with pagination
  - Returns: `{ calculations: [], pagination: {} }`

- **GET** `/api/history/:id`
  - Get a specific calculation

- **DELETE** `/api/history/:id`
  - Delete a specific calculation

- **DELETE** `/api/history`
  - Delete all calculations

## Development Scripts

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

## Database

The backend uses SQLite (via `better-sqlite3`) for storing calculation history. The database file is automatically created in `backend/data/tip_calculator.db` when you first run the server.

### Viewing the Database

You can use any SQLite viewer to inspect the database:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- VS Code extension: SQLite Viewer
- Command line: `sqlite3 backend/data/tip_calculator.db`

## Troubleshooting

### Port Already in Use

If port 3001 is already in use, change it in `backend/.env`:
```env
PORT=3002
```

And update `CORS_ORIGIN` in backend `.env` and `VITE_API_URL` in frontend `.env` accordingly.

### CORS Errors

Make sure:
1. Backend `.env` has the correct `CORS_ORIGIN` (your frontend URL)
2. Frontend `.env` has the correct `VITE_API_URL` (your backend URL)
3. Both servers are running

### Database Errors

If you encounter database errors:
1. Delete `backend/data/` directory
2. Restart the server (it will recreate the database)

## Production Deployment

For production:

1. Build the backend:
   ```bash
   npm run build
   ```

2. Set `NODE_ENV=production` in `.env`

3. Start with:
   ```bash
   npm start
   ```

4. Consider using:
   - Process manager (PM2)
   - Reverse proxy (Nginx)
   - Environment-specific database (PostgreSQL for production)

## Next Steps

- [ ] Update TipCalculator component to use API
- [ ] Add history view component
- [ ] Add error handling UI
- [ ] Add loading states
- [ ] Add offline fallback

