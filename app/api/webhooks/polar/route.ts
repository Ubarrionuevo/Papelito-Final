import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { addUserCredits } from '../credits/route';

export async function POST(request: NextRequest) {
  try {
    // Get the webhook secret from environment
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('❌ POLAR_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Get headers
    const headerPayload = headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    // Verify headers
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Missing required webhook headers');
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }

    // Get the body
    const body = await request.text();

    // Create webhook instance
    const wh = new Webhook(webhookSecret);

    let evt: any;

    try {
      // Verify the webhook
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('❌ Webhook verification failed:', err);
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
    }

    // Get the event type
    const eventType = evt.type;
    console.log('🎉 Webhook received:', eventType);

    // Handle different event types
    switch (eventType) {
      case 'order.created':
        await handleOrderCreated(evt.data);
        break;
      
      case 'order.updated':
        await handleOrderUpdated(evt.data);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(evt.data);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(evt.data);
        break;
      
      case 'subscription.canceled':
        await handleSubscriptionCanceled(evt.data);
        break;
      
      case 'payment.completed':
        await handlePaymentCompleted(evt.data);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(evt.data);
        break;
      
      default:
        console.log('ℹ️ Unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Event handlers
async function handleOrderCreated(data: any) {
  console.log('🛒 Order created:', {
    orderId: data.id,
    customerId: data.customer_id,
    amount: data.amount,
    currency: data.currency,
    status: data.status
  });
  
  // Determine plan and credits based on amount
  const { plan, credits } = getPlanFromAmount(data.amount);
  
  if (plan && credits) {
    // Get user ID from customer data
    const userId = getUserIdFromCustomer(data.customer) || data.customer_id;
    
    if (userId) {
      addUserCredits(userId, credits, plan, data.customer?.email);
      console.log(`🎉 Order created: Activated ${credits} credits for user ${userId} (${plan} plan)`);
      
      // Track purchase completion (server-side)
      console.log(`📊 Analytics: Purchase completed - ${plan} plan ($${amountInDollars})`);
    } else {
      console.log('❌ Could not determine user ID for order:', data.id);
    }
  }
}

async function handleOrderUpdated(data: any) {
  console.log('🛒 Order updated:', {
    orderId: data.id,
    status: data.status
  });
  
  // TODO: Handle order status changes
}

async function handleSubscriptionCreated(data: any) {
  console.log('📋 Subscription created:', {
    subscriptionId: data.id,
    customerId: data.customer_id,
    status: data.status,
    planId: data.product_id
  });
  
  // TODO: Handle new subscription
  // - Activate user account
  // - Grant subscription benefits
  // - Send confirmation email
}

async function handleSubscriptionUpdated(data: any) {
  console.log('📋 Subscription updated:', {
    subscriptionId: data.id,
    status: data.status
  });
  
  // TODO: Handle subscription changes
}

async function handleSubscriptionCanceled(data: any) {
  console.log('📋 Subscription canceled:', {
    subscriptionId: data.id,
    customerId: data.customer_id
  });
  
  // TODO: Handle subscription cancellation
  // - Revoke access
  // - Send cancellation email
  // - Update user status
}

async function handlePaymentCompleted(data: any) {
  console.log('💳 Payment completed:', {
    paymentId: data.id,
    orderId: data.order_id,
    amount: data.amount,
    currency: data.currency
  });
  
  // Determine plan and credits based on amount
  const { plan, credits } = getPlanFromAmount(data.amount);
  
  if (plan && credits) {
    // Get user ID from customer data
    const userId = getUserIdFromCustomer(data.customer) || data.customer_id;
    
    if (userId) {
      addUserCredits(userId, credits, plan, data.customer?.email);
      console.log(`🎉 Payment completed: Activated ${credits} credits for user ${userId} (${plan} plan)`);
      
      // Track purchase completion (server-side)
      const amountInDollars = data.amount / 100;
      console.log(`📊 Analytics: Purchase completed - ${plan} plan ($${amountInDollars})`);
    } else {
      console.log('❌ Could not determine user ID for payment:', data.id);
    }
  }
}

async function handlePaymentFailed(data: any) {
  console.log('💳 Payment failed:', {
    paymentId: data.id,
    orderId: data.order_id,
    reason: data.failure_reason
  });
  
  // TODO: Handle failed payment
  // - Send failure notification
  // - Retry payment if needed
  // - Update order status
}

// Helper function to determine plan and credits from amount
function getPlanFromAmount(amount: number): { plan: string | null; credits: number | null } {
  // Convert from cents to dollars if needed
  const amountInDollars = amount / 100;
  
  if (amountInDollars === 5) {
    return { plan: 'starter', credits: 1000 };
  } else if (amountInDollars === 10) {
    return { plan: 'professional', credits: 2000 };
  }
  
  console.log(`⚠️ Unknown amount: ${amountInDollars} - no credits assigned`);
  return { plan: null, credits: null };
}

// Helper function to get user ID from customer data
function getUserIdFromCustomer(customer: any): string | null {
  // Try different possible fields for user identification
  if (customer?.email) {
    return customer.email;
  }
  if (customer?.id) {
    return customer.id;
  }
  if (customer?.customer_id) {
    return customer.customer_id;
  }
  
  console.log('⚠️ Could not determine user ID from customer data:', customer);
  return null;
}
