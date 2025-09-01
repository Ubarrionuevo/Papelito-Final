import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse FormData instead of JSON
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen válida' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${imageFile.type};base64,${base64Image}`;

    // Prepare request to Flux Kontext API
    const fluxRequest = {
      prompt: "Colorize this black and white image with realistic and vibrant colors, maintaining the original style and details",
      input_image: dataURI,
      aspect_ratio: "1:1",
      output_format: "png"
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
        { error: 'Error al procesar la imagen con la API de colorización' },
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

