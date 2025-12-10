import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Base de datos limpiada");

  // Crear usuarios
  const clientHash = await bcrypt.hash("123456", 10);
  const agentHash = await bcrypt.hash("123456", 10);

  const client = await prisma.user.create({
    data: {
      name: "Cliente Test",
      email: "client@example.com",
      password: clientHash,
      role: "client",
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: "Agente Soporte",
      email: "agent@example.com",
      password: agentHash,
      role: "agent",
    },
  });

  console.log("✅ Usuarios creados");

  // Crear tickets de prueba
  const ticket1 = await prisma.ticket.create({
    data: {
      title: "Error en login",
      description: "No puedo iniciar sesión con mi cuenta",
      status: "open",
      priority: "high",
      userId: client.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "Problema con impresora",
      description:
        "La impresora de la oficina no funciona correctamente",
      status: "in_progress",
      priority: "medium",
      userId: client.id,
    },
  });

  console.log("✅ Tickets creados");

  // Crear comentarios de prueba
  await prisma.comment.create({
    data: {
      content: "Estamos revisando el problema de autenticación",
      ticketId: ticket1.id,
      userId: agent.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        "Hemos reiniciado la impresora, por favor intenta nuevamente",
      ticketId: ticket2.id,
      userId: agent.id,
    },
  });

  console.log("✅ Comentarios creados");
  console.log("\n✨ Datos de prueba cargados exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
