// lib/services/authService.ts
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authService = {
  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, message: "User not found" };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { success: false, message: "Invalid password" };

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    return { success: true, data: { user, token } };
  },

  register: async (name: string, email: string, password: string, role: string) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, message: "User already exists" };

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    return { success: true, data: { user, token } };
  },
};
