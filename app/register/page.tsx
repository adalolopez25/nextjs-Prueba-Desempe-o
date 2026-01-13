"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"client" | "agent">("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const success = await register(name, email, password, role);
    
    if (success) {
      setTimeout(() => {
        router.push("/dashboard/" + role);
      }, 500);
    } else {
      setError("Error al registrar. El email ya puede estar en uso.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden py-12 px-4">
      {/* Background Blobs Animados con Tailwind */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-lg p-8 bg-slate-900/40 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Crear Cuenta</h1>
          <p className="text-indigo-500 text-xs font-bold tracking-[0.2em] uppercase mt-2">
            Únete a HelpDeskPro
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 ml-1">Nombre Completo</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 ml-1">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 ml-1">Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 ml-1">Confirmar</label>
              <input
                type="password"
                placeholder="Repite contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 ml-1">Tipo de Cuenta</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "client" | "agent")}
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              disabled={loading}
            >
              <option value="client" className="bg-slate-900">Cliente - Crear tickets</option>
              <option value="agent" className="bg-slate-900">Agente - Resolver tickets</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/40 px-2 text-slate-500 backdrop-blur-xl">O vuelve al</span></div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-3 bg-transparent border border-slate-700 hover:bg-slate-800/50 text-slate-300 font-semibold rounded-xl transition-all text-sm"
        >
          Iniciar Sesión
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[99] bg-slate-950/70 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-bold text-lg">Creando tu cuenta</p>
            <p className="text-slate-500 text-xs mt-1">Configurando tu perfil de {role === "agent" ? "Agente" : "Cliente"}...</p>
          </div>
        </div>
      )}
    </div>
  );
}