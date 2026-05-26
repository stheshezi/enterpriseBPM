import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'enterprise-bpm-platform',
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error' },
      { status: 500 }
    );
  }
}
