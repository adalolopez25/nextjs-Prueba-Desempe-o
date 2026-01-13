import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketid: string }> }
) {
  // 1. Declaramos la variable fuera del try para que sea accesible en todo el scope
  let user: any = null; 

  try {
    user = await getAuthUser(); // Asignamos el valor
    const { ticketid } = await params;
    const { message } = await req.json();

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "Auth required" }, { status: 401 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content: message,
        userId: user.id,
        ticketId: ticketid,
      },
      include: {
        user: { select: { name: true } }
      }
    });

    return NextResponse.json({ success: true, data: newComment });

  } catch (error: any) {
    console.error("DEBUG PRISMA:", error.code, error.message);
    
    // Ahora 'user' sí existe aquí porque se declaró arriba
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        error: `Database Integrity Error: User ID ${user?.id || 'unknown'} or Ticket ID missing.` 
      }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}