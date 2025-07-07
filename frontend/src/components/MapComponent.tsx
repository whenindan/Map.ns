'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapMarker, WaterQualityLocation } from '@/types/waterQuality'

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapComponentProps {
  markers: MapMarker[]
  onMarkerClick: (location: WaterQualityLocation) => void
}

export default function MapComponent({ markers, onMarkerClick }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})

  useEffect(() => {
    if (!mapContainer.current) return

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmd0cmRhdCIsImEiOiJjbHlkeHN4MmQwOXdkMnFvOW94Y2o4c29vIn0.b1vqUVEDdkEU0IYEYACoWw'

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.8, 10.2],
      zoom: 7
    })

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new mapboxgl.Marker({
        color: markerData.province === 'Soc Trang' ? '#3B82F6' : '#EF4444'
      })
        .setLngLat(markerData.coordinates)
        .addTo(map.current!)

      // Add click event
      marker.getElement().addEventListener('click', () => {
        onMarkerClick(markerData.data)
      })

      // Store marker reference
      markersRef.current[markerData.location] = marker
    })
  }, [markers, onMarkerClick])

  return (
    <div 
      ref={mapContainer}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  )
} 