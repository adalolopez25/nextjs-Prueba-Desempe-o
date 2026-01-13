import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { User, TicketStatus } from "@/types";

interface RouteParams {
  params: Promise<{ ticketid: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const user = (await getAuthUser()) as User | null;
    const resolvedParams = await params;
    const id = resolvedParams.ticketid;

    console.log("API: Buscando ticket con ID:", id); // Log de control

    if (!user) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "ID no proporcionado" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: id },
      include: { 
        user: { select: { id: true, name: true, email: true } } 
      }
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket no encontrado" }, { status: 404 });
    }

    // Seguridad: Agente ve todo, cliente solo lo suyo
    if (user.role === "client" && ticket.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Prohibido" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error("API GET ERROR:", error);
    return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "agent") {
      return NextResponse.json({ success: false, error: "Solo agentes" }, { status: 401 });
    }
    const { ticketid } = await params;
    const { status }: { status: TicketStatus } = await req.json();

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketid },
      data: { status },
    });
    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    const { ticketid } = await params;
    if (!user || user.role !== "agent") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }
    await prisma.ticket.delete({ where: { id: ticketid } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}