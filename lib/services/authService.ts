// lib/services/authService.ts
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// IMPORTANTE: Usa "secret" en todos los archivos o configúralo en el .env
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authService = {
  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, message: "User not found" };

    // Validación dual (Bcrypt o Texto Plano para tus pruebas manuales)
    let valid = false;
    if (user.password.startsWith("$2")) {
      valid = await bcrypt.compare(password, user.password);
    } else {
      valid = password === user.password;
    }
    
    if (!valid) return { success: false, message: "Invalid password" };

    // ARREGLO: Agregamos el EMAIL al token porque lib/auth.ts lo requiere
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "2h" }
    );

    return { success: true, data: { user, token } };
  },

  register: async (name: string, email: string, password: string, role: string) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, message: "User already exists" };

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });

    // ARREGLO: Agregamos el EMAIL aquí también
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "2h" }
    );

    return { success: true, data: { user, token } };
  },
};