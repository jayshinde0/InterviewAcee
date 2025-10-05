import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/database/connection'

export async function GET() {
  try {
    const health = await checkDatabaseHealth()
    
    const response: any = {
      status: health.healthy ? 'healthy' : 'unhealthy',
      message: health.message,
      timestamp: new Date().toISOString()
    }
    
    if (health.error) {
      response.error = health.error instanceof Error ? health.error.message : 'Unknown error'
    }
    
    return NextResponse.json(response, {
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