'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchComponentProps {
  onSearch: (location: string) => void
}

export default function SearchComponent({ onSearch }: SearchComponentProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    // Load all available locations for search suggestions
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const [socTrangData, traVinhData] = await Promise.all([
        fetch('/api/data/soc-trang').then(res => res.json()),
        fetch('/api/data/tra-vinh').then(res => res.json())
      ])

      const allLocations = [
        ...socTrangData.data.map((item: any) => item.location),
        ...traVinhData.data.map((item: any) => item.location)
      ]

      setLocations(allLocations)
    } catch (error) {
      console.error('Error loading locations:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 0) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (location: string) => {
    setQuery(location)
    onSearch(location)
    setShowSuggestions(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search for a location..."
          className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50">
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(location)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 