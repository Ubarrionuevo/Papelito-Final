import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Mock webhook for simulation
    // In real implementation, this would handle Stripe webhooks
    
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

    // Simulate adding credits for testing
    if (mockEvent.type === 'payment_intent.succeeded') {
      const { userId, planId } = mockEvent.data.object.metadata;
      
      // Add credits based on plan (simulation)
      let creditsToAdd = 1000; // Default
      if (planId === 'professional') {
        creditsToAdd = 3000;
      }
      
      if (userId && userId !== 'user_mock') {
        const success = AuthService.addCredits(userId, creditsToAdd);
        if (success) {
          console.log(`Simulation: Added ${creditsToAdd} credits to user ${userId}`);
        }
      }
    }

    return NextResponse.json({ 
      received: true, 
      message: 'Webhook processed (simulation mode)' 
    }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
