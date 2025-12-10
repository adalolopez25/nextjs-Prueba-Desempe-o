// app/api/comments/[ticketId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { ticketId: params.ticketId },
      include: { user: true },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Error al obtener comentarios" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const user = await getAuthUser();

  if (!user)
    return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });

  try {
    const { message } = await req.json();

    if (!message)
      return NextResponse.json({ success: false, error: "El mensaje es obligatorio" }, { status: 400 });

    const newComment = await prisma.comment.create({
      data: {
        content: message,
        ticketId: params.ticketId,
        userId: user.id,
      },
      include: { user: true },
    });

    console.log("Comentario agregado:", newComment.id);

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Error al crear comentario" },
      { status: 500 }
    );
  }
}
