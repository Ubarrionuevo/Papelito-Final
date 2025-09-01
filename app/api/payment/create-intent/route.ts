import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, PaymentIntent } from '../../../../lib/types';
import { plans } from '../../../../lib/config';

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

    // Find the plan
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid plan'
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Verify the user exists
    // 2. Create a Stripe PaymentIntent
    // 3. Store the payment intent in your database
    // 4. Return the client secret

    // For now, we'll create a mock payment intent
    const mockPaymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      planId,
      amount: plan.price * 100, // Stripe uses cents
      currency: plan.currency.toLowerCase(),
      status: 'pending',
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    return NextResponse.json<ApiResponse<PaymentIntent>>({
      success: true,
      data: mockPaymentIntent,
      message: 'Payment intent created successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
