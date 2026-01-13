import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session")?.value;

  const protectedPaths = ["/client", "/tickets", "/ticket"];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  // RUTA PÚBLICA (Login/Registro)
  const isPublicRoute = pathname === "/" || pathname === "/register";

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/client", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};