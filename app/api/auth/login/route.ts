import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/authService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const result = await authService.login(email, password);
    
    if (result.success && result.data?.token) {
      const response = NextResponse.json(result);
      response.cookies.set("token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2, // 2 hours
      });
      return response;
    }
    
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error logging in" });
  }
}
