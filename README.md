# Water Quality Monitoring System

A modern, interactive water quality monitoring application built with Next.js and Python Flask, featuring real-time data visualization and AI-powered chatbot assistance for water quality analysis in Vietnam's Mekong Delta region.

## 🌊 Features

- **Interactive Map**: MapBox GL JS powered map with location markers for Soc Trang and Tra Vinh provinces
- **Real-time Data Visualization**: Dynamic charts and graphs using Chart.js for historical water quality trends
- **Smart Search**: Autocomplete search functionality for quick location lookup
- **AI Chatbot**: WebSocket-based intelligent assistant for water quality inquiries
- **Responsive Design**: Mobile-friendly interface with clean, modern UI
- **Multi-language Support**: Vietnamese to English translation for measurement parameters
- **Type Safety**: Full TypeScript implementation for robust development

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.5** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **MapBox GL JS** - Interactive mapping
- **Chart.js** - Data visualization
- **Tailwind CSS** - Utility-first styling
- **WebSocket** - Real-time chat communication

### Backend
- **Python FastAPI** - Web application framework
- **SQLite** - Database for water quality data
- **JSON** - Data storage and processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd water-quality-nextjs
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   pip install flask flask-cors
   ```

4. **Environment Configuration**
   
   Create a `.env.local` file in the frontend directory:
   ```bash
   # Add your MapBox access token
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   python app.py
   ```
   The FastAPI server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The Next.js app will run on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
water-quality-nextjs/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── MapComponent.tsx
│   │   │   ├── InfoPanel.tsx
│   │   │   ├── ChartComponent.tsx
│   │   │   └── ChatBot.tsx
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets and data files
│   │   └── data/           # Water quality JSON data
│   ├── package.json
│   └── tsconfig.json
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── data/               # Data processing and storage
│   │   └── JSON_proc/      # Processed JSON data files
│   └── sqldata/            # SQLite database files
├── README.md
└── .gitignore
```

## 🗺️ Features Overview

### Interactive Map
- **Province Coverage**: Soc Trang (blue markers) and Tra Vinh (red markers)
- **Click Interaction**: Click markers to view detailed water quality data
- **Zoom & Pan**: Full map navigation with MapBox controls

### Data Visualization
- **Historical Charts**: Time-series data for various water quality parameters
- **Parameter Selection**: Dropdown menu to switch between measurements:
  - pH levels
  - Temperature
  - Alkalinity
  - Transparency
  - Salinity
  - And more...

### Search Functionality
- **Autocomplete**: Type-ahead search for location names
- **Province Search**: Search by province name (Soc Trang, Tra Vinh)
- **Instant Results**: Real-time filtering and suggestions

### AI Chatbot
- **WebSocket Connection**: Real-time communication
- **Water Quality Expertise**: Specialized in water analysis queries
- **Connection Status**: Visual indicator for connection state

## 🔧 Configuration

### MapBox Setup
1. Create a free account at [MapBox](https://www.mapbox.com/)
2. Generate an access token
3. Add the token to your `.env.local` file

### Data Sources
- Water quality measurements are stored in JSON format
- Historical data available for Soc Trang province locations
- Real-time data integration ready for expansion

## 🌍 Deployment

### Frontend (Vercel)
```bash
npm run build
npm start
```

### Backend (Python Hosting)
```bash
pip install -r requirements.txt
python app.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Data Structure

### Water Quality Parameters
- **pH**: Acidity/alkalinity levels
- **Temperature**: Water temperature in Celsius
- **Alkalinity**: Buffer capacity measurement
- **Transparency**: Water clarity indicator
- **Salinity**: Salt content measurement
- **Dissolved Oxygen**: Oxygen concentration
- **BOD5/COD**: Biological/Chemical oxygen demand

### Location Data Format
```json
{
  "location": "Location Name",
  "time": "2024-01-15 10:30:00",
  "coordinates": [longitude, latitude],
  "pH": {"value": "7.2", "unit": "", "name": "pH"},
  "temperature": {"value": "28.5", "unit": "°C", "name": "Temperature"}
}
```

## 🔗 API Endpoints

### Frontend Routes
- `/` - Main application interface
- `/api/data/soc-trang` - Soc Trang province data
- `/api/data/tra-vinh` - Tra Vinh province data

### Backend Endpoints
- `GET /api/locations` - Get all monitoring locations
- `GET /api/historical/{location}` - Get historical data for location
- `WebSocket /ws/chat` - Chatbot communication



---

**Built with ❤️ for water quality monitoring in Vietnam's Mekong Delta**
