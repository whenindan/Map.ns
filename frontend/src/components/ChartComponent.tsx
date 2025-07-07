'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { HistoricalLocationData } from '@/types/waterQuality'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartComponentProps {
  historicalData: HistoricalLocationData
  selectedMeasurementIndex?: number
}

export default function ChartComponent({ historicalData, selectedMeasurementIndex = 0 }: ChartComponentProps) {
  const chartRef = useRef<ChartJS<'line'> | null>(null)

  if (!historicalData || !historicalData.measurements || historicalData.measurements.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        No historical data available for this location
      </div>
    )
  }

  const prepareChartData = () => {
    if (Array.isArray(historicalData.measurements) && historicalData.measurements.length > 0) {
      const selectedMeasurement = historicalData.measurements[selectedMeasurementIndex]
      
      if (selectedMeasurement && selectedMeasurement.data && Array.isArray(selectedMeasurement.data)) {
        // Sort data by date
        const sortedData = [...selectedMeasurement.data].sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'))
          const dateB = new Date(b.date.split('/').reverse().join('-'))
          return dateA.getTime() - dateB.getTime()
        })

        const labels = sortedData.map(item => item.date)
        const values = sortedData.map(item => parseFloat(item.value))

        return {
          labels,
          datasets: [{
            label: selectedMeasurement.type,
            data: values,
            borderColor: '#007cbf',
            backgroundColor: 'rgba(0, 124, 191, 0.08)',
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#007cbf',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#007cbf',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
            fill: true
          }]
        }
      }
    }

    // Fallback: return empty data
    return {
      labels: [],
      datasets: []
    }
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeInOutQuart'
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12,
          weight: 'normal'
        },
        padding: {
          top: 12,
          bottom: 12,
          left: 16,
          right: 16
        },
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}`
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: 'normal'
          },
          maxTicksLimit: 6,
          padding: 8
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
          lineWidth: 1
        },
        border: {
          color: '#e5e7eb',
          width: 1
        }
      },
      y: {
        display: true,
        title: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: 'normal'
          },
          padding: 8
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
          lineWidth: 1
        },
        border: {
          color: '#e5e7eb',
          width: 1
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  const chartData = prepareChartData()

  if (chartData.datasets.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        No chart data available
      </div>
    )
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '280px',
      position: 'relative'
    }}>
      <Line
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
    </div>
  )
} 