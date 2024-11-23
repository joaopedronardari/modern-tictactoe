import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/api/socket/io');
    
    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Socket is running' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Socket initialization failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
