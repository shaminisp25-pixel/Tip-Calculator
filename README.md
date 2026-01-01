# Tip Calculator

A beautiful and intuitive tip calculator application with a full-stack architecture. Calculate tips, split bills, and manage expenses with ease.

## Features

- 🧮 **Easy Tip Calculation**: Calculate tips with preset percentages (10%, 12%, 15%, 18%, 20%) or custom amounts
- 👥 **Bill Splitting**: Split bills evenly among multiple people
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✨ **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 💾 **Backend Integration**: Saves calculation history to database
- 🔄 **Offline Support**: Falls back to local calculation if backend is unavailable

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (Button, Input, Card)
- **Routing**: React Router DOM
- **State Management**: React Hooks + TanStack Query
- **Icons**: Lucide React

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: SQLite (better-sqlite3)
- **API**: RESTful endpoints

## Project Structure

```
tip-calculator/
├── backend/              # Backend API server
│   ├── src/
│   │   ├── server.ts     # Express server
│   │   ├── database.ts   # Database setup
│   │   └── routes/       # API routes
│   ├── package.json
│   └── README.md
├── src/                  # Frontend source
│   ├── components/       # React components
│   │   ├── TipCalculator.tsx
│   │   └── ui/          # UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and API client
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── package.json         # Frontend dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd tip-calculator
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**:
   
   Create `.env` in the project root:
   ```env
   VITE_API_URL=http://localhost:3001
   ```
   
   Create `backend/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_PATH=./data/tip_calculator.db
   CORS_ORIGIN=http://localhost:8080
   ```

### Running the Application

1. **Start the backend server** (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:3001`

2. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:8080`

3. **Open your browser**:
   Navigate to `http://localhost:8080` to view the application.

## Available Scripts

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Type check without building

## API Endpoints

The backend provides the following endpoints:

- `POST /api/calculations` - Calculate tip and save to history
- `POST /api/calculations/validate` - Validate calculation without saving
- `GET /api/history` - Get calculation history (with pagination)
- `GET /api/history/:id` - Get a specific calculation
- `DELETE /api/history/:id` - Delete a specific calculation
- `GET /health` - Server health check

See `backend/README.md` for detailed API documentation.

## Usage

1. Enter the **bill amount** in the input field
2. Select a **tip percentage** from the preset buttons or enter a custom percentage
3. Enter the **number of people** to split the bill
4. Click **Calculate** to see:
   - Tip amount
   - Total with tip
   - Amount per person

Calculations are automatically saved to the database when the backend is connected.

## Building for Production

### Frontend
```bash
npm run build
```
The optimized files will be in the `dist/` directory.

### Backend
```bash
cd backend
npm run build
npm start
```

## Deployment

This project can be deployed to various platforms:

- **Frontend**: Vercel, Netlify, GitHub Pages, or any static hosting
- **Backend**: Railway, Render, Heroku, or any Node.js hosting service

Make sure to:
1. Set environment variables on your hosting platform
2. Update `VITE_API_URL` to point to your deployed backend
3. Update `CORS_ORIGIN` in backend to allow your frontend domain

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

