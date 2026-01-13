# FreightQuote Pro - Shipment Quote Calculator

A professional, modern shipment quote calculator application built with React, TypeScript, and Tailwind CSS. This frontend application provides an intuitive interface for calculating freight shipping quotes with full backend integration, real-time data fetching, and comprehensive quote management.

## Features

### Pages
- **Dashboard**: Overview of shipping activity with quick stats and navigation
- **New Quote**: Interactive form to request shipment quotes with real-time calculation and API integration
- **Quote History**: Comprehensive table view with filtering, search, and pagination capabilities

### Components
- **QuoteForm**: Multi-field form with validation for origin, destination, equipment type, weight, pickup date, and accessorial services
- **QuoteResult**: Detailed breakdown display showing base rate, equipment multiplier, weight surcharge, fuel surcharge, and total cost
- **QuoteHistoryTable**: Filterable table with search and backend-powered data fetching
- **AppSidebar**: Modern collapsible sidebar navigation using shadcn/ui
- **Header**: Responsive header with breadcrumb navigation

### Design System
- Professional logistics-focused color scheme with deep blue primary and amber accents
- Fully responsive layout optimized for desktop and mobile devices
- Semantic color tokens for consistent theming
- Smooth transitions and modern UI components using shadcn/ui
- Dark mode support via next-themes

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Server state management and data fetching
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide React** - Beautiful icon system
- **Vite** - Fast build tool and dev server
- **date-fns** - Date manipulation utilities
- **Recharts** - Data visualization

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see backend README for setup)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd shipment-quote-calculator/frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables (optional):
Create a \`.env\` file for custom API configuration:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will be available at \`http://localhost:8080\`

### Available Scripts

- \`npm run dev\` - Start development server with HMR
- \`npm run build\` - Build for production
- \`npm run build:dev\` - Build in development mode
- \`npm run preview\` - Preview production build locally
- \`npm run lint\` - Run ESLint

## Project Structure

\`\`\`
src/
├── components/
│   ├── Layout/
│   │   ├── AppSidebar.tsx       # Collapsible sidebar navigation
│   │   └── Header.tsx           # Header with breadcrumbs
│   ├── Quote/
│   │   ├── QuoteForm.tsx        # Quote request form with validation
│   │   ├── QuoteResult.tsx      # Quote breakdown display
│   │   └── QuoteHistoryTable.tsx # Historical quotes table
│   ├── NavLink.tsx              # Custom navigation link component
│   └── ui/                      # Reusable shadcn components (50+ components)
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── sidebar.tsx
│       └── ... (and many more)
├── pages/
│   ├── Dashboard.tsx            # Dashboard/home page
│   ├── QuoteFormPage.tsx        # New quote page
│   ├── QuoteHistoryPage.tsx     # Quote history page
│   └── NotFound.tsx             # 404 page
├── hooks/
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/
│   ├── api.ts                   # API client with TypeScript interfaces
│   └── utils.ts                 # Utility functions
├── config/
│   └── api.ts                   # API base URL configuration
├── App.tsx                      # Main app with routing and providers
├── main.tsx                     # Application entry point
└── index.css                    # Global styles and design tokens
\`\`\`

## Backend Integration

This application is **fully integrated** with a PostgreSQL-backed API. Key endpoints:

### API Endpoints

**Create Quote**: \`POST /api/quotes\`
**Get Quotes**: \`GET /api/quotes\` (with filters)
**Get Lanes**: \`GET /api/quotes/meta/lanes\`
**Search Cities**: \`GET /api/quotes/meta/origin-cities\`

See \`src/lib/api.ts\` for full API client implementation.

### Environment Configuration

**Development**: Proxies \`/api\` to \`http://localhost:5000\`
**Production**: Uses \`VITE_API_URL\` environment variable

## PostgreSQL Backend

This frontend works with a PostgreSQL backend featuring:
- Connection pooling
- ENUM types for status
- Precise decimal handling
- Timezone-aware timestamps
- Optimized indexes

Setup guide: [Backend PostgreSQL Setup](../backend/POSTGRESQL_SETUP.md)

## Development Workflow

1. Start backend: \`cd backend && npm run dev\`
2. Start frontend: \`cd frontend && npm run dev\`
3. Access at \`http://localhost:8080\`

## Production Deployment

Build: \`npm run build\`
Set \`VITE_API_URL\` to your production API endpoint
Deploy to Vercel, Netlify, Render, or AWS

## License

MIT License

## Documentation

- [Backend Setup](../backend/POSTGRESQL_SETUP.md)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
