import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth';
import { ApiResponse, User } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = AuthService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User already exists'
      }, { status: 409 });
    }

    // Create new user with 1 free credit
    const user = AuthService.createUser(email, name);

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
      message: 'User created successfully with 1 free credit'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
