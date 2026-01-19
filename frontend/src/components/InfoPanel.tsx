'use client'

import { useState, useEffect } from 'react'
import { WaterQualityLocation, MapMarker, WaterQualityMeasurement, HistoricalLocationData } from '@/types/waterQuality'
import ChartComponent from './ChartComponent'

interface InfoPanelProps {
  selectedLocation: WaterQualityLocation | null
  markers: MapMarker[]
  onLocationSelect: (location: WaterQualityLocation) => void
}

export default function InfoPanel({ selectedLocation, markers, onLocationSelect }: InfoPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [historicalData, setHistoricalData] = useState<HistoricalLocationData | null>(null)
  const [selectedMeasurementIndex, setSelectedMeasurementIndex] = useState<number>(0)

  // Auto-load historical data when location changes
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!selectedLocation) {
        setHistoricalData(null)
        return
      }

      const marker = markers.find(m => m.location === selectedLocation.location)
      if (!marker || marker.province !== 'Soc Trang') {
        setHistoricalData(null)
        return
      }

      try {
        const response = await fetch('/data/Sensory_Measurements/Soc_Trang/JSON_proc/compiled_historical_data_st.json')
        const data = await response.json()

        const locationData = data.find((entry: HistoricalLocationData) =>
          entry.location === selectedLocation.location
        )

        if (locationData) {
          setHistoricalData(locationData)
          setSelectedMeasurementIndex(0)
        } else {
          setHistoricalData(null)
        }
      } catch (error) {
        console.error('Error loading historical data:', error)
        setHistoricalData(null)
      }
    }

    loadHistoricalData()
  }, [selectedLocation, markers])

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredSuggestions = markers
        .filter(marker =>
          marker.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          marker.province.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(marker => marker.location)
        .slice(0, 5)

      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, markers])

  const handleSearch = () => {
    if (searchQuery.toLowerCase() === 'soc trang') {
      // Show all Soc Trang markers
      const socTrangMarkers = markers.filter(m => m.province === 'Soc Trang')
      if (socTrangMarkers.length > 0) {
        onLocationSelect(socTrangMarkers[0].data)
      }
    } else if (searchQuery.toLowerCase() === 'tra vinh') {
      // Show all Tra Vinh markers
      const traVinhMarkers = markers.filter(m => m.province === 'Tra Vinh')
      if (traVinhMarkers.length > 0) {
        onLocationSelect(traVinhMarkers[0].data)
      }
    } else {
      // Search for specific location
      const marker = markers.find(m =>
        m.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (marker) {
        onLocationSelect(marker.data)
      }
    }
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    const marker = markers.find(m => m.location === suggestion)
    if (marker) {
      onLocationSelect(marker.data)
    }
  }

  // Translation function for measurement types
  const translateMeasurementType = (vietnameseName: string): string => {
    const translations: { [key: string]: string } = {
      'pH': 'pH',
      'Nhiệt độ nước': 'Temperature',
      'Kiềm': 'Alkalinity',
      'Độ trong': 'Transparency',
      'Độ mặn': 'Salinity',
      'Oxy hòa tan': 'Dissolved Oxygen',
      'BOD5': 'BOD5',
      'COD': 'COD',
      'TSS': 'Total Suspended Solids',
      'Coliform': 'Coliform',
      'Nitrat': 'Nitrate',
      'Photphat': 'Phosphate',
      'Amoniac': 'Ammonia',
      'Độ mặn so với năm trước': 'Salinity comparison to previous year',
    };

    return translations[vietnameseName] || vietnameseName;
  };



  const renderMeasurementValue = (key: string, value: any) => {
    if (typeof value === 'object' && value !== null && 'value' in value) {
      const measurement = value as WaterQualityMeasurement
      return (
        <div key={key} style={{ margin: '6px 0', color: '#e5e5e5', fontSize: '14px' }}>
          <strong style={{ color: '#ffffff', fontSize: '14px' }}>{measurement.name}:</strong>
          <span style={{ marginLeft: '6px', fontWeight: '500' }}>
            {measurement.value} {measurement.unit !== 'none' ? measurement.unit : ''}
          </span>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      padding: '16px',
      paddingBottom: '120px',
      backgroundColor: '#0a0a0a',
      fontFamily: '"Open Sans", sans-serif'
    }}>
      {/* Search Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search location..."
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '2px solid #404040',
              borderRadius: '10px 0 0 10px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#666666'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#404040'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 18px',
              border: '2px solid #ffffff',
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: '0 10px 10px 0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e5e5'
              e.currentTarget.style.borderColor = '#e5e5e5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
              e.currentTarget.style.borderColor = '#ffffff'
            }}
          >
            Search
          </button>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#1a1a1a',
              border: '2px solid #404040',
              borderRadius: '10px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
              maxHeight: '180px',
              overflowY: 'auto',
              zIndex: 1000,
              marginTop: '2px'
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderBottom: index < suggestions.length - 1 ? '1px solid #262626' : 'none',
                    fontSize: '14px',
                    backgroundColor: '#1a1a1a',
                    color: '#e5e5e5',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#262626'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a'
                    e.currentTarget.style.color = '#e5e5e5'
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Info Section */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#ffffff',
          borderBottom: '2px solid #ffffff',
          paddingBottom: '4px',
          display: 'inline-block'
        }}>
          Location Info
        </h2>

        {selectedLocation ? (
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #404040',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {selectedLocation.location}
            </h3>

            <div style={{
              margin: '8px 0',
              color: '#e5e5e5',
              fontSize: '14px',
              padding: '8px',
              backgroundColor: '#0a0a0a',
              borderRadius: '6px',
              border: '1px solid #262626'
            }}>
              <strong style={{ color: '#ffffff', fontSize: '14px' }}>Time:</strong>
              <span style={{ marginLeft: '6px', fontWeight: '500' }}>{selectedLocation.time}</span>
            </div>

            <div style={{
              display: 'grid',
              gap: '4px',
              marginTop: '12px'
            }}>
              {Object.entries(selectedLocation).map(([key, value]) => {
                if (key === 'location' || key === 'time' || key === 'coordinates') {
                  return null
                }
                return renderMeasurementValue(key, value)
              })}
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '20px',
            borderRadius: '12px',
            border: '2px dashed #404040',
            textAlign: 'center',
            color: '#666666',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Select a location on the map to view details
          </div>
        )}
      </div>

      {/* Graph Section - Auto-display when historical data is available */}
      {historicalData && (
        <div style={{
          marginBottom: '16px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid #404040',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header with title */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #404040'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: 0
            }}>
              Historical Data
            </h3>
          </div>

          {/* Measurement Type Dropdown */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #404040' }}>
            <select
              value={selectedMeasurementIndex}
              onChange={(e) => setSelectedMeasurementIndex(parseInt(e.target.value))}
              style={{
                padding: '8px 12px',
                border: '2px solid #404040',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                cursor: 'pointer',
                width: '100%',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#666666'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#404040'
              }}
            >
              {historicalData.measurements.map((measurement, index) => (
                <option key={index} value={index}>
                  {translateMeasurementType(measurement.type)}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable Chart Area */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '16px'
          }}>
            <ChartComponent historicalData={historicalData} selectedMeasurementIndex={selectedMeasurementIndex} />
          </div>
        </div>
      )}
    </div>
  )
} 