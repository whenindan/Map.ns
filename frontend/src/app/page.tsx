'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { WaterQualityLocation, MapMarker } from '@/types/waterQuality';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

const InfoPanel = dynamic(() => import('@/components/InfoPanel'), {
  ssr: false
});

const ChatBot = dynamic(() => import('@/components/ChatBot'), {
  ssr: false
});

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<WaterQualityLocation | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWaterQualityData();
  }, []);

  const loadWaterQualityData = async () => {
    try {
      const [socTrangResponse, traVinhResponse] = await Promise.all([
        fetch('/data/Sensory_Measurements/Soc_Trang/JSON_proc/soctrang-locations.json'),
        fetch('/data/Sensory_Measurements/Tra_Vinh/JSON_proc/travinh-locations.json')
      ]);

      const socTrangData = await socTrangResponse.json();
      const traVinhData = await traVinhResponse.json();

      const allMarkers: MapMarker[] = [];

      // Process Soc Trang data
      socTrangData.data.forEach((item: WaterQualityLocation) => {
        if (item.coordinates !== 'Unknown') {
          allMarkers.push({
            location: item.location,
            province: 'Soc Trang',
            coordinates: [item.coordinates[1], item.coordinates[0]] as [number, number],
            data: item
          });
        }
      });

      // Process Tra Vinh data
      traVinhData.data.forEach((item: WaterQualityLocation) => {
        if (item.coordinates !== 'Unknown') {
          allMarkers.push({
            location: item.location,
            province: 'Tra Vinh',
            coordinates: [item.coordinates[1], item.coordinates[0]] as [number, number],
            data: item
          });
        }
      });

      setMarkers(allMarkers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading water quality data:', error);
      setLoading(false);
    }
  };

  const handleMarkerClick = (location: WaterQualityLocation) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading water quality data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Map Container - 75% */}
      <div className="w-3/4 h-full">
        <MapComponent 
          markers={markers}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Info Panel - 25% */}
      <div className="w-1/4 h-full bg-gray-50 border-l border-gray-200">
        <InfoPanel 
          selectedLocation={selectedLocation}
          markers={markers}
          onLocationSelect={handleMarkerClick}
        />
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
} 