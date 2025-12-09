import { NextResponse } from 'next/server';
import { findUserByCredentials } from '@/lib/data';
import { ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('API /api/auth/login: Received request', { email });

    const user = findUserByCredentials(email, password);
    if (user) {
      // Remove password before sending
      const { password: _, ...userWithoutPass } = user;
      console.log('API /api/auth/login: User found', userWithoutPass);
      return NextResponse.json<ApiResponse>({ success: true, data: userWithoutPass });
    } else {
      console.log('API /api/auth/login: Invalid credentials');
      return NextResponse.json<ApiResponse>({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('API /api/auth/login: Error', error);
    return NextResponse.json<ApiResponse>({ success: false, error: 'Server error' }, { status: 500 });
  }
}