import { NextRequest, NextResponse } from 'next/server';
import { ColorizeRequest } from '../../../types/api';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body: ColorizeRequest = await request.json();
    const { prompt, input_image, aspect_ratio, output_format } = body;

    // Validate required fields
    if (!input_image) {
      return NextResponse.json({ 
        success: false, 
        error: 'Input image is required' 
      }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prompt is required' 
      }, { status: 400 });
    }

    // Validate image format (should be base64 string)
    if (typeof input_image !== 'string' || input_image.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid image format. Must be base64 string.' 
      }, { status: 400 });
    }

    // Get API key from environment or use fallback
    const apiKey = process.env.BFL_API_KEY || '5d7ceb5a-1731-4d9c-b68c-e87ec381ea72';
    console.log('🔑 Environment check:', {
      BFL_API_KEY: apiKey ? '✅ Configured' : '❌ Not configured',
      NODE_ENV: process.env.NODE_ENV,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('BFL')),
      fallbackUsed: !process.env.BFL_API_KEY
    });

    // Prepare request for FLUX Kontext API
    const fluxRequest = {
      prompt: prompt,
      input_image: input_image,
      aspect_ratio: aspect_ratio || "1:1",
      output_format: output_format || "jpeg",
      safety_tolerance: 2
    };

    console.log('🔍 FLUX Request details:', {
      prompt: prompt.substring(0, 50) + '...',
      input_image_length: input_image.length,
      aspect_ratio: aspect_ratio || "1:1",
      output_format: output_format || "jpeg",
      safety_tolerance: 2,
      apiKey: apiKey ? '✅ Present' : '❌ Missing'
    });

    // Call FLUX Kontext API
    const response = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fluxRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FLUX Kontext API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestData: {
          prompt: prompt.substring(0, 100) + '...',
          input_image_length: input_image.length,
          aspect_ratio: aspect_ratio || "1:1",
          output_format: output_format || "jpeg"
        }
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `FLUX API error: ${response.status} ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('FLUX Kontext API response:', data);
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        polling_url: data.polling_url,
        status: 'submitted'
      },
      message: 'Image processing started successfully'
    });

  } catch (error) {
    console.error('Colorize API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

