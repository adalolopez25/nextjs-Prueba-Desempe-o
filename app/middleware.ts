import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

const PROTECTED_API = ["/api/tickets", "/api/comments"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_API.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const decoded = verifyJwt(token);

  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Token inválido" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
