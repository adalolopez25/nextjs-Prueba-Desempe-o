// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// USA LA MISMA CLAVE QUE EN EL LOGIN
const JWT_SECRET = process.env.JWT_SECRET || "secret"; 

export function signJwt(user: { id: string; role: string; email: string }) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies(); // En Next.js 14/15 no siempre es async, mejor sin await aquí
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload) return null;

  // No hace falta buscar en Prisma aquí si solo necesitamos el ID y el Role
  // Esto hace que el API sea mucho más rápido
  return payload; 
}