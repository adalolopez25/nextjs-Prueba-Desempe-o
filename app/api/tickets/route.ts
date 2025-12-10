// app/api/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth"; // función que obtiene el usuario desde el token

export async function GET() {
  const user = await getAuthUser(); // ✅ await aquí
  if (!user)
    return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });

  try {
    const tickets =
      user.role === "agent"
        ? await prisma.ticket.findMany()
        : await prisma.ticket.findMany({ where: { userId: user.id } });

    return NextResponse.json({ success: true, data: tickets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Error al obtener tickets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(); // ✅ await aquí también
  if (!user)
    return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });

  const { title, description, priority } = await req.json();

  if (!title || !description)
    return NextResponse.json(
      { success: false, error: "Campos obligatorios vacíos" },
      { status: 400 }
    );

  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "medium",
        userId: user.id,
      },
    });

    console.log("📧 Email enviado: Ticket creado");

    return NextResponse.json({ success: true, data: newTicket });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Error al crear ticket" }, { status: 500 });
  }
}
