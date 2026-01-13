"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ticketService } from "@/lib/services";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function NewTicketPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return setError("Usuario no autenticado");
  if (!title.trim() || !description.trim())
    return setError("El título y la descripción son obligatorios");

  setLoading(true);
  setError("");

  try {
    // Usamos fetch nativo para tener control total
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        userId: user.id, // Asegúrate de que Prisma espera 'userId'
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      router.push("/dashboard/client");
    } else {
      setError(data.message || "Error al crear el ticket (401)");
    }
  } catch (err) {
    console.error("Error en la petición:", err);
    setError("Error de red al intentar crear el ticket");
  } finally {
    setLoading(false);
  }
};

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden pb-12">
        <Header />

        {/* Blobs de fondo */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 mt-12 relative z-10">
          {/* Botón Volver */}
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-sm font-bold group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Dashboard
          </button>

          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-white tracking-tight">Nuevo Ticket</h1>
              <p className="text-slate-400 mt-2">Describe el problema para que nuestro equipo pueda ayudarte.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-400 ml-1">
                  Título del Problema
                </label>
                <input
                  type="text"
                  placeholder="Ej: Error al acceder a la base de datos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Prioridad */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-400 ml-1">
                  Nivel de Urgencia
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        priority === p 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-400 ml-1">
                  Descripción Detallada
                </label>
                <textarea
                  placeholder="Explica detalladamente qué sucede..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="pt-4 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "CREANDO TICKET..." : "ENVIAR SOLICITUD"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-4 bg-transparent text-slate-500 font-bold hover:text-slate-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}