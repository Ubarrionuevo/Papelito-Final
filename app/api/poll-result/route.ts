import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollingUrl } = body;

    if (!pollingUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Polling URL is required' 
      }, { status: 400 });
    }

    // Get API key from environment
    const apiKey = process.env.BFL_API_KEY || '5d7ceb5a-1731-4d9c-b68c-e87ec381ea72';

    console.log('🔄 Proxy polling:', pollingUrl);

    // Poll FLUX Kontext API through our server (no CORS issues)
    const response = await fetch(pollingUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FLUX Kontext polling error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `FLUX API error: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('🔄 Polling result:', data);
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Polling proxy error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
