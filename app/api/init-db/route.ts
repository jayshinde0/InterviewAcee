import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/database/init-mongo'

export async function POST(request: NextRequest) {
  try {
    // Only allow initialization in development or with proper auth
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database initialization not allowed in production' },
        { status: 403 }
      )
    }

    await initializeDatabase()

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}