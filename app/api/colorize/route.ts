import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../lib/auth';
import { ApiResponse } from '../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse FormData instead of JSON
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('userId') as string;
    
    if (!imageFile) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'File must be a valid image' },
        { status: 400 }
      );
    }

    // Check if user has credits
    if (!AuthService.hasCredits(userId, 1)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Insufficient credits. Please purchase a plan to continue.' },
        { status: 402 }
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
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Error processing image with colorization API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Deduct credits from user
    const creditsDeducted = AuthService.deductCredits(userId, 1);
    if (!creditsDeducted) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to deduct credits' },
        { status: 500 }
      );
    }
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: data.id,
        polling_url: data.polling_url,
        status: 'submitted'
      },
      message: 'Image processing started successfully. 1 credit deducted.'
    }, { status: 200 });

  } catch (error) {
    console.error('Colorize API error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

