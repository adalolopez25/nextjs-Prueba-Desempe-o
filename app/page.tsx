"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // Nueva protección para Next.js

  const { login, user } = useAuth();
  const router = useRouter();

  // Evita errores de hidratación (SSR vs Client)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        // Obtenemos el usuario del localStorage DE FORMA SEGURA
        const stored = localStorage.getItem("user");
        const userData = stored ? JSON.parse(stored) : null;
        
        const target = userData?.role === "agent" 
          ? "/dashboard/agent" 
          : "/dashboard/client";

        router.push(target);
      } else {
        setError("Email o contraseña incorrectos");
        setLoading(false);
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión");
      setLoading(false);
    }
  };

  // Si el componente no ha montado en el cliente, no renderizamos nada pesado
  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Fondo Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/40 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            HelpDesk<span className="text-indigo-500">Pro</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mt-2">
            Soporte Profesional
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 ml-1">Correo Electrónico</label>
            <input
              type="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 ml-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Acceder al Sistema"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => router.push("/register")}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            ¿No tienes cuenta? <span className="text-indigo-500 font-bold">Regístrate</span>
          </button>
        </div>
      </div>
    </div>
  );
}