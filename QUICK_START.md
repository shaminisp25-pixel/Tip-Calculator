# Quick Start Guide

Get your Tip Calculator up and running in minutes!

## Step 1: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
cd ..
```

## Step 2: Configure Environment

### Frontend
Create `.env` in the project root:
```env
VITE_API_URL=http://localhost:3001
```

### Backend
Create `backend/.env`:
```bash
cd backend
cp env .env
```

Or create `backend/.env` manually:
```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/tip_calculator.db
CORS_ORIGIN=http://localhost:8080
```

## Step 3: Start Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Database initialized
🚀 Server running on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
```

## Step 4: Open in Browser

Navigate to: **http://localhost:8080**

## Verify Connection

- Look for a **green dot** in the top-left corner = Backend connected ✅
- Look for a **yellow dot** = Backend offline (using local calculation)

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Make sure `backend/.env` exists
- Check `backend/node_modules` is installed

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `VITE_API_URL` in `.env` matches backend port
- Check browser console for CORS errors

### Port already in use
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in frontend `.env`
- Update `CORS_ORIGIN` in `backend/.env`

## Next Steps

- Try calculating a tip!
- Check the database: `backend/data/tip_calculator.db`
- View API docs: `backend/README.md`

