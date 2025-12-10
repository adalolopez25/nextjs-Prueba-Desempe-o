const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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
      title: "Solicitud de nueva funcionalidad",
      description: "Me gustaría que agreguen un export a PDF",
      status: "open",
      priority: "medium",
      userId: client.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: "Error en reportes",
      description: "Los gráficos no se muestran correctamente",
      status: "in_progress",
      priority: "high",
      userId: client.id,
    },
  });

  console.log("✅ Tickets creados");

  // Crear comentarios
  await prisma.comment.create({
    data: {
      content: "Estamos investigando el problema. Por favor, intenta limpiar el caché del navegador.",
      ticketId: ticket1.id,
      userId: agent.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Gracias, lo intentaré",
      ticketId: ticket1.id,
      userId: client.id,
    },
  });

  console.log("✅ Comentarios creados");

  console.log(
    "✨ Base de datos seeded exitosamente con datos de prueba"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
