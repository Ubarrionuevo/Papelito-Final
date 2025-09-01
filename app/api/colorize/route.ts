import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json();
    const { prompt, image, aspect_ratio } = body;
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'No prompt provided' },
        { status: 400 }
      );
    }

    // Validate image format (should be base64 with data URL prefix)
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format. Must be base64 with data URL prefix' },
        { status: 400 }
      );
    }

    // Prepare request to Flux Kontext API
    const fluxRequest = {
      prompt: prompt,
      image: image,
      aspect_ratio: aspect_ratio || "1:1"
    };

    // Make request to Flux Kontext API
    const response = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-key': process.env.BFL_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fluxRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Flux Kontext API error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Error processing image with colorization API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        polling_url: data.polling_url,
        status: 'submitted'
      },
      message: 'Image processing started successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Colorize API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

