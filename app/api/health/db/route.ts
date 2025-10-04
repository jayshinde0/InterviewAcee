import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/database/connection'

export async function GET() {
  try {
    const health = await checkDatabaseHealth()
    
    return NextResponse.json({
      status: health.healthy ? 'healthy' : 'unhealthy',
      message: health.message,
      timestamp: new Date().toISOString(),
      ...(health.error && { error: health.error.message })
    }, {
      status: health.healthy ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 503
    })
  }
}