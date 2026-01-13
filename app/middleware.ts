import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session")?.value;
  const role = req.cookies.get("userRole")?.value;

  // RUTAS PROTEGIDAS (Cualquier cosa que empiece por estas carpetas)
  const isProtectedRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/tickets") || 
                           pathname.startsWith("/client");

  // 1. SI NO HAY SESIÓN:
  if (!session) {
    // Si intenta entrar a una ruta protegida, mandarlo al login (/)
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Si va a "/", dejarlo pasar para que vea el Login
    return NextResponse.next();
  }

  // 2. SI HAY SESIÓN:
  if (session) {
    // Si intenta ir al login (/) o /register, mandarlo a su dashboard según su rol
    if (pathname === "/" || pathname === "/register") {
      const target = role === "agent" ? "/dashboard/agent" : "/dashboard/client";
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};