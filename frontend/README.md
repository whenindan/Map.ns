# Water Quality Frontend

The Next.js frontend application for the water quality monitoring system. This application provides interactive mapping, data visualization, search functionality, and real-time chatbot assistance for water quality analysis.

## What's inside

- MapBox GL JS integration for interactive mapping with water quality monitoring stations
- Chart.js implementation for historical data visualization and trend analysis
- Search component with autocomplete functionality for location discovery
- WebSocket chatbot integration for real-time water quality assistance
- TypeScript implementation for type-safe development and enhanced code reliability

## Getting it running

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Main components

- `MapComponent.tsx` - Interactive map component with monitoring station markers
- `InfoPanel.tsx` - Information panel with location details and search functionality
- `ChartComponent.tsx` - Historical data visualization component
- `ChatBot.tsx` - WebSocket-based chatbot interface
- `SearchComponent.tsx` - Autocomplete search component for location discovery

## Environment setup

A MapBox access token is required for map functionality. Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
```

You can obtain a free MapBox access token from [MapBox](https://www.mapbox.com/) for development and moderate usage.

## Data structure

Water quality data is sourced from `/public/data/` directory and backend API endpoints. Each monitoring location includes geographical coordinates, measurement data, and timestamps for historical tracking.

## Deployment

This is a standard Next.js application that can be deployed to various hosting platforms. For production builds:

```bash
npm run build
```

The application is optimized for deployment on platforms like Vercel, Netlify, or similar Next.js-compatible hosting services.

