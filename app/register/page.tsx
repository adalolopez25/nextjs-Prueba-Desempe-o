"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "../login.css";

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
    <div className="login-container">
      {/* Animated background blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <div className="login-card">
        {/* Header */}
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">ÚNETE A HELPDESKPRO</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
              Nombre Completo
            </label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
              Email
            </label>
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
              Tipo de Cuenta
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "client" | "agent")}
              className="form-input"
              disabled={loading}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <option value="client">👤 Cliente - Crear solicitudes de soporte</option>
              <option value="agent">🔧 Agente - Resolver tickets</option>
            </select>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Registrando...' : '✨ Crear Cuenta'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>O vuelve al</span>
        </div>

        {/* Login Link */}
        <button
          onClick={() => router.push('/')}
          className="btn btn-secondary"
          style={{ width: '100%' }}
        >
          🔐 Iniciar Sesión
        </button>

        {/* Footer */}
        <p className="footer-text">
          ¿Ya tienes cuenta? Haz clic arriba para entrar
        </p>
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
            }}>✨</div>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '18px', margin: 0 }}>
              Creando tu cuenta...
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
