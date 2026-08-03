// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'aura8-core-clean',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}