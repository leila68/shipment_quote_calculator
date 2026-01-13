# FreightQuote Pro - Shipment Quote Calculator

A professional, modern shipment quote calculator application built with React, TypeScript, and Tailwind CSS. This frontend application provides an intuitive interface for calculating freight shipping quotes with support for multiple equipment types and real-time quote history tracking.

## Features

### Pages
- **Dashboard**: Overview of shipping activity with quick stats and navigation
- **New Quote**: Interactive form to request shipment quotes with real-time calculation
- **Quote History**: Comprehensive table view with filtering and search capabilities

### Components
- **QuoteForm**: Multi-field form with validation for origin, destination, equipment type, weight, and pickup date
- **QuoteResult**: Detailed breakdown display showing base rate, equipment multiplier, weight factor, and total cost
- **QuoteHistoryTable**: Filterable table with search by lane/ID and filters for equipment type and status
- **Header**: Responsive navigation with active route highlighting

### Design System
- Professional logistics-focused color scheme with deep blue primary and amber accents
- Fully responsive layout optimized for desktop and mobile devices
- Semantic color tokens for consistent theming
- Smooth transitions and modern UI components using shadcn/ui

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon system
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shipment-quote-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Header.tsx          # Main navigation header
│   ├── Quote/
│   │   ├── QuoteForm.tsx       # Quote request form
│   │   ├── QuoteResult.tsx     # Quote breakdown display
│   │   └── QuoteHistoryTable.tsx # Historical quotes table
│   └── ui/                     # Reusable shadcn components
├── pages/
│   ├── Dashboard.tsx           # Dashboard/home page
│   ├── QuoteFormPage.tsx       # New quote page
│   ├── QuoteHistoryPage.tsx    # Quote history page
│   └── NotFound.tsx            # 404 page
├── hooks/                      # Custom React hooks
├── lib/
│   └── utils.ts                # Utility functions
├── App.tsx                     # Main app component with routing
├── main.tsx                    # Application entry point
└── index.css                   # Global styles and design tokens
```

## Backend Integration Points

This is a **frontend scaffold** ready for backend integration. The following areas require API implementation:

### 1. Quote Calculation (QuoteFormPage.tsx)
Replace the mock calculation logic with actual API call:
```typescript
// TODO: Replace mock calculation with API call
// POST /api/quotes/calculate
// Body: { originCity, destinationCity, equipmentType, totalWeight, pickupDate }
// Response: { baseRate, equipmentMultiplier, weightFactor, total }
```

### 2. Quote History (QuoteHistoryTable.tsx)
Implement API call to fetch historical quotes:
```typescript
// TODO: Fetch quotes from backend
// GET /api/quotes?search=&equipmentType=&status=
// Response: Array<Quote>
```

### 3. Dashboard Statistics (Dashboard.tsx)
Replace mock stats with real data:
```typescript
// TODO: Fetch dashboard stats
// GET /api/dashboard/stats
// Response: { totalQuotes, activeShipments, totalSpent }
```

## Design System

The application uses a comprehensive design system defined in `src/index.css` and `tailwind.config.ts`:

### Color Palette
- **Primary**: Deep blue (#0B63E5) - Trust, logistics
- **Accent**: Amber (#F59E0B) - Energy, action
- **Success**: Green - Completed actions
- **Warning**: Amber - Alerts
- **Muted**: Neutral grays - Secondary content

### Component Variants
All components use semantic tokens from the design system for consistent theming across light and dark modes.

## Customization

### Adding New Equipment Types
Edit the select options in `QuoteForm.tsx`:
```typescript
<SelectItem value="new-type">New Equipment Type</SelectItem>
```

### Modifying Quote Calculations
Update the calculation logic in `QuoteFormPage.tsx` or connect to your backend API endpoint.

### Styling Changes
All design tokens are centralized in `src/index.css`. Modify the CSS variables to update the entire theme.

## Future Enhancements

Potential features to add:
- User authentication and account management
- Save quotes for later reference
- Export quotes to PDF
- Email quote summaries
- Real-time shipment tracking
- Multi-stop route calculation
- Integration with carrier APIs for live rates

## Contributing

This is a scaffold project. When integrating with your backend:
1. Replace all TODO comments with actual API implementations
2. Add proper error handling for API calls
3. Implement authentication if required
4. Add loading states for async operations
5. Consider adding form validation libraries like Zod

## License

MIT License - feel free to use this scaffold for your projects.
