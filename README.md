# Shipment Quote Calculator

A freight broker shipment quoting tool with rate calculation and quote history.

## Tech Stack

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)

## Setup Instructions

### 1. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Set up environment variables
```bash
# Copy example env file in backend
cp backend/.env.example backend/.env
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Run the application
```bash
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## Project Structure
```
shipment-quote-calculator/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── config/   # Database setup
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/    # Rate calculator & seed data
│   └── data/         # SQLite database (gitignored)
├── frontend/         # React application
│   └── src/
│       ├── components/
│       ├── pages/
│       └── lib/      # API client
└── package.json      # Root scripts
```

## API Endpoints

- `POST /api/quotes` - Create new quote
- `GET /api/quotes` - Get all quotes (with filters)
- `GET /api/quotes/:id` - Get single quote
- `GET /api/quotes/meta/lanes` - Get available lanes

## Features

- ✅ Real-time rate calculation
- ✅ Quote history with filtering
- ✅ Lane-based pricing
- ✅ Equipment type multipliers
- ✅ Weight-based surcharges
