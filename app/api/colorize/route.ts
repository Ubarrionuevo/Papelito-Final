import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, input_image, aspect_ratio, output_format, safety_tolerance } = body;

    // Validate required fields
    if (!prompt || !input_image) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and input_image' },
        { status: 400 }
      );
    }

    // Prepare request to Flux Kontext API
    const fluxRequest = {
      prompt,
      input_image: input_image,
      ...(aspect_ratio && { aspect_ratio }),
      ...(output_format && { output_format }),
      ...(safety_tolerance && { safety_tolerance })
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
        { error: 'Failed to process image with Flux Kontext API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: data.id,
      polling_url: data.polling_url,
      status: 'submitted'
    });

  } catch (error) {
    console.error('Colorize API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

