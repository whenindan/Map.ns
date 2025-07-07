export interface WaterQualityMeasurement {
  name: string;
  value: number | string;
  unit: string;
}

export interface WaterQualityLocation {
  location: string;
  time: string;
  coordinates: [number, number] | string;
  [key: string]: any; // For additional measurement fields
}

export interface WaterQualityData {
  date_created: string;
  datetime_format: string;
  data: WaterQualityLocation[];
}

export interface HistoricalDataPoint {
  date: string;
  value: string;
}

export interface HistoricalMeasurementType {
  type: string;
  data: HistoricalDataPoint[];
}

export interface HistoricalLocationData {
  location: string;
  measurements: HistoricalMeasurementType[];
}

export interface MapMarker {
  location: string;
  province: string;
  coordinates: [number, number];
  data: WaterQualityLocation;
}

export interface ChatMessage {
  type: 'user' | 'bot' | 'system';
  message: string;
  timestamp: Date;
} 