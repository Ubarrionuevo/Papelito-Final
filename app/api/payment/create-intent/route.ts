import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId } = body;

    if (!userId || !planId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID and Plan ID are required'
      }, { status: 400 });
    }

    // Mock payment intent for simulation
    const mockPaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      planId,
      status: 'pending',
      message: 'Payment simulation - credits will be added automatically'
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockPaymentIntent,
      message: 'Payment intent created (simulation mode)'
    }, { status: 200 });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
