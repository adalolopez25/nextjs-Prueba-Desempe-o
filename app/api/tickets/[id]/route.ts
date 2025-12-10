// app/api/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    });

    if (!ticket)
      return NextResponse.json(
        { success: false, error: "Ticket no encontrado" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: ticket });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Error al obtener ticket" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();

  if (!user)
    return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });

  if (user.role !== "agent")
    return NextResponse.json(
      { success: false, error: "Solo agentes pueden editar" },
      { status: 403 }
    );

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    });

    if (!ticket)
      return NextResponse.json(
        { success: false, error: "Ticket no existe" },
        { status: 404 }
      );

    const body = await req.json();

    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: {
        status: body.status ?? ticket.status,
        priority: body.priority ?? ticket.priority,
      },
    });

    console.log("Ticket actualizado:", updatedTicket.id);

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Error al actualizar ticket" },
      { status: 500 }
    );
  }
}
