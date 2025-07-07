import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const dataPath = join(process.cwd(), '..', 'backend', 'data', 'JSON_proc', 'travinh-locations.json')
    const data = readFileSync(dataPath, 'utf8')
    
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error('Error reading Tra Vinh data:', error)
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
} 