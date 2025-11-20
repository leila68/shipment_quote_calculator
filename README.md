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

### 1. Clone the Repository
```bash
git clone https://github.com/leila68/shipment_quote_calculator.git
cd shipment-quote-calculator
```

### 2. Install dependencies
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

### 3. Set up environment variables
```bash
# Copy example env file in backend
cp backend/.env.example backend/.env
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Run the application
```bash
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Frontend: http://localhost:8080

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
│       │   ├── Quote/ # Components for quote-related functionality
│       │   ├── ui/    # Reusable UI components (e.g., buttons, cards)
│       ├── hooks/     # Custom React hooks
│       ├── lib/       # API client and utility functions
│       ├── pages/     # Page components for routing
│       ├── styles/    # Global styles and Tailwind configuration
│       └── App.tsx    # Main application entry point
└── package.json      # Root scripts
```

## API Endpoints

- **`GET /api/quotes/meta/lanes`**  
  Get available lanes (origin and destination cities).

- **`POST /api/quotes/calculate`**  
  Calculate a quote without saving it to the database.

- **`POST /api/quotes`**  
  Create a new quote and save it to the database.

- **`GET /api/quotes`**  
  Get all quotes with optional filters (e.g., by status, lane, etc.).

- **`PATCH /api/quotes/:id/status`**  
  Update the status of a specific quote (e.g., `created`, `sent`, `accepted`).

- **`GET /api/quotes/:id`**  
  Get details of a specific quote by its ID.

## Features

- Real-time rate calculation
- Lane-based pricing
- Equipment type multipliers
- Weight-based surcharges
- Accessories (Liftgate Service, Scheduled Delivery, Residential Delivery)
- Quote History with Filtering: Adding the ability to filter by date, origin/destination, or equipment type

## Future Work
- Quote Export: Enable exporting quotes as CSV or PDF.
- Rate Insights: Display average rate per mile for a selected lane or equipment type.
