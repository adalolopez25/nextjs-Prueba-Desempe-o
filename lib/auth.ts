// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma"; // Prisma client

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Firma un JWT para un usuario
export function signJwt(user: { id: string; role: string; email: string }) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Verifica un JWT
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
  } catch {
    return null;
  }
}

// Obtiene el usuario autenticado desde la cookie y Prisma
export async function getAuthUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token = tokenCookie?.value;

  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload) return null;

  // Busca el usuario directamente en la base de datos con Prisma
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  return user;
}
