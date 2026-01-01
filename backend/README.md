# Tip Calculator Backend API

Backend API server for the Tip Calculator application, built with Express.js and TypeScript.

## Features

- ✅ RESTful API for tip calculations
- ✅ SQLite database for calculation history
- ✅ CORS enabled for frontend integration
- ✅ TypeScript for type safety
- ✅ Input validation
- ✅ Error handling

## API Endpoints

### Calculations

- `POST /api/calculations` - Calculate tip and save to history
  ```json
  {
    "billAmount": 100.00,
    "tipPercent": 15,
    "numberOfPeople": 2
  }
  ```

- `POST /api/calculations/validate` - Validate calculation without saving
  ```json
  {
    "billAmount": 100.00,
    "tipPercent": 15,
    "numberOfPeople": 2
  }
  ```

### History

- `GET /api/history` - Get calculation history (with pagination)
  - Query params: `?limit=50&offset=0`

- `GET /api/history/:id` - Get a specific calculation

- `DELETE /api/history/:id` - Delete a specific calculation

- `DELETE /api/history` - Delete all calculations

### Health Check

- `GET /health` - Server health check

## Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT` - Server port (default: 3001)
   - `CORS_ORIGIN` - Frontend URL (default: http://localhost:8080)
   - `DB_PATH` - Database file path

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Database

The backend uses SQLite (via `better-sqlite3`) for storing calculation history. The database file is created automatically in the `data/` directory.

### Database Schema

```sql
CREATE TABLE calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_amount REAL NOT NULL,
  tip_percent REAL NOT NULL,
  number_of_people INTEGER NOT NULL,
  tip_amount REAL NOT NULL,
  total_with_tip REAL NOT NULL,
  amount_per_person REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Type check without building

## Project Structure

```
backend/
├── src/
│   ├── server.ts          # Main server file
│   ├── database.ts        # Database setup and connection
│   └── routes/
│       ├── calculations.ts # Calculation endpoints
│       └── history.ts      # History endpoints
├── dist/                  # Compiled JavaScript (generated)
├── data/                  # SQLite database (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Integration with Frontend

The backend is configured to accept requests from the frontend running on `http://localhost:8080`. Update the `CORS_ORIGIN` in `.env` if your frontend runs on a different port.

## License

MIT

