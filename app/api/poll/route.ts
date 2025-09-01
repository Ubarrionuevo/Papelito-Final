import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { polling_url } = body;

    if (!polling_url) {
      return NextResponse.json(
        { error: 'Missing polling_url' },
        { status: 400 }
      );
    }

    // Make request to Flux Kontext polling URL
    const response = await fetch(polling_url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-key': process.env.BFL_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Flux Kontext polling error:', errorData);
      return NextResponse.json(
        { error: 'Failed to poll Flux Kontext API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      status: data.status,
      result: data.result,
      error: data.error
    });

  } catch (error) {
    console.error('Polling API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
