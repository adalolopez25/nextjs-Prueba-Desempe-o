"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Header from "@/components/layout/Header";
import { Ticket, TicketStatus } from "@/types";
import '../dashboard.css';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTickets();
  };

  const statusOptions: { value: TicketStatus | "all"; label: string }[] = [
    { value: "all", label: "All Tickets" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <span className="badge badge-primary">Abierto</span>;
      case "in_progress":
        return <span className="badge badge-warning">En Progreso</span>;
      case "resolved":
        return <span className="badge badge-success">Resuelto</span>;
      case "closed":
        return <span className="badge badge-danger">Cerrado</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <span className="badge badge-primary">Baja</span>;
      case "medium":
        return <span className="badge badge-warning">Media</span>;
      case "high":
        return <span className="badge badge-danger">Alta</span>;
      default:
        return <span className="badge badge-primary">{priority}</span>;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["agent"]}>
        <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '16px',
            padding: '48px',
            zIndex: 50
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              animation: 'spin 2s linear infinite'
            }}>⚙️</div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Bienvenido a HelpDeskPro
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 24px 0' }}>
              Preparando tu dashboard de agente...
            </p>
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, rgb(239, 68, 68), rgb(251, 146, 60))',
                animation: 'progress 2s ease-in-out infinite'
              }}></div>
            </div>
          </div>

          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes progress {
              0% { width: 0%; }
              50% { width: 100%; }
              100% { width: 0%; }
            }
          `}</style>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["agent"]}>
      <div className="dashboard-container">
        <Header />
        
        {/* Welcome Message */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.1))',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          margin: '0 24px 24px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'slideIn 0.5s ease-out'
        }}>
          <div style={{ fontSize: '32px' }}>🔧</div>
          <div>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
              ¡Hola, {user?.name}!
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0 }}>
              Centro de soporte técnico. Aquí puedes gestionar todos los tickets pendientes.
            </p>
          </div>
        </div>
        
        <div style={{ padding: '24px' }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className="btn"
                style={{
                  background: filter === opt.value 
                    ? 'linear-gradient(90deg, rgb(239, 68, 68), rgb(251, 146, 60))'
                    : 'rgba(148, 163, 184, 0.2)',
                  color: 'white',
                  border: filter === opt.value ? 'none' : '1px solid rgba(148, 163, 184, 0.3)',
                  padding: '8px 16px'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {filteredTickets.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div className="empty-icon">📭</div>
              <h2 className="empty-title">No hay tickets en esta categoría</h2>
              <p className="empty-text">Los tickets aparecerán aquí cuando se creen</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  className="dashboard-card fade-in"
                  style={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="card-title">{t.title}</h3>
                      <p className="card-description">{t.description}</p>
                      <p className="card-description" style={{ fontSize: '11px', marginTop: '8px' }}>
                        👤 {t.userId} • 📅 {new Date(t.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      {getStatusBadge(t.status)}
                      {getPriorityBadge(t.priority)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {t.status === "open" && (
                        <button
                          onClick={() => handleStatusChange(t.id, "in_progress")}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          🟡 En Progreso
                        </button>
                      )}
                      {t.status === "in_progress" && (
                        <button
                          onClick={() => handleStatusChange(t.id, "resolved")}
                          className="btn btn-success"
                          style={{ fontSize: '12px', padding: '6px 12px', background: 'linear-gradient(90deg, rgb(34, 197, 94), rgb(74, 222, 128))' }}
                        >
                          ✅ Resuelto
                        </button>
                      )}
                      {t.status === "resolved" && (
                        <button
                          onClick={() => handleStatusChange(t.id, "closed")}
                          style={{ 
                            fontSize: '12px', 
                            padding: '6px 12px',
                            background: 'linear-gradient(90deg, rgb(239, 68, 68), rgb(248, 113, 113))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ⚫ Cerrar
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => window.location.href = `/tickets/${t.id}`}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Ver Detalles →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', top: '300px', right: '50px', width: '288px', height: '288px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '100px', left: '50px', width: '288px', height: '288px', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
      </div>
    </ProtectedRoute>
  );
}
