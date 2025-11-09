# Qpick Dashboard

A comprehensive restaurant management dashboard built with SvelteKit, TypeScript, and Tailwind CSS. This application provides restaurant owners and administrators with tools to manage their business operations, including menu management, order tracking, user management, and analytics.

## Features

### 🏪 Restaurant Management
- Create and manage multiple restaurants
- Restaurant settings and configuration
- User access control per restaurant
- Restaurant performance analytics

### 📋 Menu Management
- Menu item creation and editing with variants
- Category management and organization
- Menu highlights and featured items
- Image upload and management
- Bulk menu operations

### 📦 Order Management
- Real-time order tracking
- Advanced filtering and search
- Order status management
- Historical order reports

### 🎨 Marketing Tools
- Banner management with aspect ratio controls
- Promotional content management
- Marketing campaign tools

### 👥 User Management
- Multi-role user system (Platform Admin, Restaurant Admin)
- User creation and permission management
- User activity tracking

### 📊 Analytics & Reporting
- Sales performance charts
- Restaurant performance metrics
- User activity analytics
- Custom report generation

### 🪑 Seating Management
- Interactive table layout designer
- QR code generation for tables
- Table management and configuration

### ⭐ Review Management
- Customer review tracking
- Review filtering and management
- Review analytics

## Tech Stack

- **Framework**: SvelteKit 2.x with TypeScript
- **Styling**: Tailwind CSS 4.x with PostCSS
- **UI Components**: Skeleton UI + Custom component library
- **State Management**: Svelte stores + TanStack Query
- **Charts**: Chart.js
- **Maps**: Leaflet
- **Utilities**: Zod for validation, Lucide icons
- **Development**: ESLint, Prettier, TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Package manager (npm, pnpm, yarn, or bun)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tomah-dashboard
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Development

### Project Structure
```
src/
├── lib/
│   ├── components/     # Reusable components organized by feature
│   ├── stores/         # Svelte stores for state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions and helpers
│   ├── queries/        # TanStack Query functions
│   └── cache/          # Caching system
├── routes/
│   ├── (pladmin)/      # Platform admin routes
│   ├── (rsadmin)/      # Restaurant admin routes
│   └── api/            # API endpoints
└── static/             # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run deploy` - Deploy to Vercel

### Code Style
- TypeScript for all new files
- Component-based architecture
- Responsive design (mobile-first)
- Accessible UI components
- Comprehensive error handling

## Features Overview

### Dashboard
- Real-time metrics and KPIs
- Sales performance charts
- Recent orders and activity
- Quick action shortcuts

### Multi-tenant Architecture
- Platform admin can manage multiple restaurants
- Restaurant admins have scoped access to their restaurant
- Role-based permissions and access control

### Advanced Caching System
- Memory caching for frequently accessed data
- API response caching
- Database query optimization
- Cache monitoring and statistics

### Responsive Design
- Mobile-first responsive design
- Touch-friendly interfaces
- Progressive web app capabilities
- Cross-browser compatibility

## Contributing

Please refer to the development guidelines in `/guide/` for detailed information about:
- Architecture decisions
- Development phases
- Feature development guidelines
- Testing strategies

## License

This project is private and proprietary.
