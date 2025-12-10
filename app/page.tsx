"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      setTimeout(() => {
        router.push("/dashboard/client");
      }, 500);
    } else {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    }
  };

  const testLogin = async (role: "client" | "agent") => {
    setLoading(true);
    setError("");
    try {
      const testEmail = role === "client" ? "client@example.com" : "agent@example.com";
      const testPassword = "123456";

      // Intenta login primero
      let loginSuccess = await login(testEmail, testPassword);

      // Si no funciona, intenta registrar (en caso de que sea la primera vez)
      if (!loginSuccess) {
        const registerSuccess = await register(
          role === "client" ? "Client Test" : "Agent Test",
          testEmail,
          testPassword,
          role
        );

        if (registerSuccess) {
          loginSuccess = await login(testEmail, testPassword);
        }
      }

      if (loginSuccess) {
        setTimeout(() => {
          router.push(role === "client" ? "/dashboard/client" : "/dashboard/agent");
        }, 500);
        return;
      }

      setError("Error al iniciar sesión. Verifica tu conexión.");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error procesando datos. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated background blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <div className="login-card">
        {/* Header */}
        <h1 className="login-title">HelpDeskPro</h1>
        <p className="login-subtitle">SOPORTE PROFESIONAL</p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Autenticando...' : '🔐 Acceder'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>O prueba con</span>
        </div>

        {/* Demo Buttons */}
        <div className="demo-buttons">
          <button
            onClick={() => testLogin("client")}
            className="btn btn-success"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Cargando...' : '👤 Cliente Demo'}
          </button>
          <button
            onClick={() => testLogin("agent")}
            className="btn btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Cargando...' : '🔧 Agente Demo'}
          </button>
        </div>

        {/* Footer */}
        <p className="footer-text">
          Cliente: client@example.com | Agente: agent@example.com
        </p>

        {/* Register Link */}
        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ color: '#cbd5e1', fontSize: '12px', margin: '0 0 12px 0' }}>
            ¿No tienes cuenta?
          </p>
          <button
            onClick={() => router.push('/register')}
            className="btn btn-secondary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            📝 Crear una Nueva Cuenta
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(147, 51, 234, 0.2))',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'spin 1s linear infinite'
            }}>⏳</div>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '18px', margin: 0 }}>
              Iniciando sesión...
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
              Por favor espera un momento
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
