# Water Quality Monitoring App

A web application for monitoring water quality data from Soc Trang and Tra Vinh provinces in Vietnam. The application provides interactive mapping, data visualization, and real-time assistance for water quality analysis.

## What it does

- Interactive map displaying water quality monitoring stations with color-coded markers (blue for Soc Trang, red for Tra Vinh)
- Real-time water quality data visualization for individual monitoring locations
- Location search functionality with autocomplete suggestions
- Historical data charts and trend analysis for Soc Trang province locations
- WebSocket-based chatbot integration for water quality inquiries
- Responsive design optimized for desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 15** 
- **TypeScript** 
- **Mapbox GL** - Interactive mapping library for web applications
- **Chart.js**
- **Tailwind CSS**

### Backend  
- **FastAPI**
- **SQLite** 
- **JSON files** 

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- Python 3.8+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/whenindan/Map.ns.git
   cd Map.ns
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   The backend server will start on http://localhost:5000

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend application will start on http://localhost:3000

## Project Structure

```
├── backend/              # FastAPI server
│   ├── app.py           # Main server file
│   ├── data/            # JSON data files
│   └── requirements.txt # Python dependencies
├── frontend/            # Next.js app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── app/         # Next.js pages
│   │   └── types/       # TypeScript definitions
│   └── public/data/     # Static data files
└── README.md           # This file
```

## Features

- **Interactive Map**: Click on monitoring stations to view detailed water quality data
- **Location Search**: Search functionality with autocomplete suggestions for easy navigation
- **Historical Charts**: Data visualization and trend analysis for Soc Trang locations
- **Real-time Chat**: WebSocket chatbot integration for water quality assistance
- **Mobile Responsive**: Optimized user experience across all device sizes

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/data/soc-trang` - Retrieve Soc Trang location data
- `GET /api/data/tra-vinh` - Retrieve Tra Vinh location data  
- `GET /api/data/historical/soc-trang` - Retrieve historical charts data
- `WebSocket /ws/chat` - Real-time chatbot communication

## Known Issues

- Historical data visualization is currently available only for Soc Trang province
- Map loading times may vary depending on network conditions
- WebSocket connection stability may be affected by network conditions
- Search response times may vary based on data volume

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bug reports and feature requests.

## Data Sources

Water quality data sourced from Vietnam Mekong Delta research initiatives. Historical data coverage varies by monitoring location and extends back several years.

---

*Built for water quality monitoring and environmental research in Vietnam's Mekong Delta region.*


