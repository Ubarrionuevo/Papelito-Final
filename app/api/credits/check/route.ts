import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../../lib/auth';
import { ApiResponse, CreditCheckResponse } from '../../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Check if user exists and has credits
    const user = AuthService.getUser(userId);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const currentCredits = AuthService.getCreditBalance(userId);
    const requiredCredits = 1; // 1 credit per image
    const hasCredits = AuthService.hasCredits(userId, requiredCredits);
    const canProcess = hasCredits;

    const response: CreditCheckResponse = {
      hasCredits,
      currentCredits,
      requiredCredits,
      canProcess,
    };

    return NextResponse.json<ApiResponse<CreditCheckResponse>>({
      success: true,
      data: response,
      message: hasCredits ? 'User has sufficient credits' : 'Insufficient credits'
    }, { status: 200 });

  } catch (error) {
    console.error('Credit check error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
