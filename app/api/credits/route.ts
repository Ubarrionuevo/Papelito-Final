import { NextRequest, NextResponse } from 'next/server';
import { getCreditsMap } from './utils';

// Get the credits map
const userCredits = getCreditsMap();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userCredit = userCredits.get(userId);
    
    if (!userCredit) {
      // New user - give 1 free credit
      const newUserCredit = { credits: 1, plan: 'free' };
      userCredits.set(userId, newUserCredit);
      return NextResponse.json({
        credits: 1,
        plan: 'free',
        isNewUser: true
      });
    }

    return NextResponse.json({
      credits: userCredit.credits,
      plan: userCredit.plan,
      email: userCredit.email,
      isNewUser: false
    });

  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, credits, plan, email } = body;

    if (!userId || credits === undefined || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update user credits
    userCredits.set(userId, { credits, plan, email });
    
    console.log(`✅ Credits updated for user ${userId}: ${credits} credits (${plan} plan)`);

    return NextResponse.json({
      success: true,
      credits,
      plan,
      message: 'Credits updated successfully'
    });

  } catch (error) {
    console.error('Credits update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, creditsToDeduct } = body;

    if (!userId || creditsToDeduct === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userCredit = userCredits.get(userId);
    
    if (!userCredit) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userCredit.credits < creditsToDeduct) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        availableCredits: userCredit.credits,
        requestedCredits: creditsToDeduct
      }, { status: 400 });
    }

    // Deduct credits
    userCredit.credits -= creditsToDeduct;
    userCredits.set(userId, userCredit);
    
    console.log(`💳 Credits deducted for user ${userId}: ${creditsToDeduct} credits (remaining: ${userCredit.credits})`);

    return NextResponse.json({
      success: true,
      credits: userCredit.credits,
      plan: userCredit.plan,
      message: 'Credits deducted successfully'
    });

  } catch (error) {
    console.error('Credits deduction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

