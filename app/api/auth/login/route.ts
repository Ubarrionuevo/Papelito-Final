import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../lib/auth';
import { ApiResponse, User } from '../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Find user by email
    const user = AuthService.getUserByEmail(email);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
      message: 'Login successful'
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
