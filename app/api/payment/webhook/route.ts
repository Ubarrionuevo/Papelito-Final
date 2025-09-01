import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth';
import { plans } from '../../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Verify the webhook signature using Stripe
    // 2. Parse the event
    // 3. Handle different event types

    // For now, we'll handle a mock successful payment
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_mock',
          metadata: {
            userId: 'user_mock',
            planId: 'professional'
          }
        }
      }
    };

    // Handle successful payment
    if (mockEvent.type === 'payment_intent.succeeded') {
      const { userId, planId } = mockEvent.data.object.metadata;
      const plan = plans.find(p => p.id === planId);

      if (plan && userId) {
        // Add credits to user
        const success = AuthService.addCredits(userId, plan.credits, `Plan: ${plan.name}`);
        
        if (success) {
          console.log(`Added ${plan.credits} credits to user ${userId}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
