export interface WaterQualityData {
  location: string
  date: string
  time?: string
  coordinates: [number, number] | 'Unknown'
  [key: string]: {
    name: string
    value: number | string
    unit: string
  } | string | [number, number] | 'Unknown'
}

export interface LocationData {
  location: string
  measurements: MeasurementData[]
}

export interface MeasurementData {
  type: string
  data: DataPoint[]
}

export interface DataPoint {
  date: string
  value: string | number
}

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
}

export interface MapMarker {
  location: string
  province: string
  coordinates: [number, number]
  data: WaterQualityData
} 