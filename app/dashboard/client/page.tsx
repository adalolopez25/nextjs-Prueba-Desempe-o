'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Header from '@/components/layout/Header';
import { useState, useEffect } from 'react';
import { Ticket } from '@/types';
import '../dashboard.css';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="badge badge-primary">Abierto</span>;
      case 'in_progress':
        return <span className="badge badge-warning">En Progreso</span>;
      case 'resolved':
        return <span className="badge badge-success">Resuelto</span>;
      case 'closed':
        return <span className="badge badge-danger">Cerrado</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <span className="badge badge-primary">Baja</span>;
      case 'medium':
        return <span className="badge badge-warning">Media</span>;
      case 'high':
        return <span className="badge badge-danger">Alta</span>;
      default:
        return <span className="badge badge-primary">{priority}</span>;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['client']}>
        <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '16px',
            padding: '48px',
            zIndex: 50
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              animation: 'spin 2s linear infinite'
            }}>✨</div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Bienvenido a HelpDeskPro
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 24px 0' }}>
              Preparando tu dashboard...
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
                background: 'linear-gradient(90deg, rgb(37, 99, 235), rgb(168, 85, 247))',
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
    <ProtectedRoute allowedRoles={['client']}>
      <div className="dashboard-container">
        <Header />
        
        {/* Welcome Message */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(168, 85, 247, 0.1))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          margin: '24px 24px 0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'slideIn 0.5s ease-out'
        }}>
          <div style={{ fontSize: '32px' }}>👋</div>
          <div>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
              ¡Hola, {user?.name}!
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0 }}>
              Bienvenido a tu panel de control. Aquí puedes gestionar todos tus tickets de soporte.
            </p>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {tickets.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div className="empty-icon">📭</div>
              <h2 className="empty-title">No tienes tickets aún</h2>
              <p className="empty-text">Crea tu primer ticket para solicitar soporte</p>
              <button
                onClick={() => router.push('/tickets/new')}
                className="btn btn-primary"
                style={{ marginTop: '24px' }}
              >
                ➕ Crear Primer Ticket
              </button>
            </div>
          ) : (
            <div className="dashboard-grid">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="dashboard-card fade-in"
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <h3 className="card-title">{ticket.title}</h3>
                    <p className="card-description">
                      📅 {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <p className="card-description" style={{ marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.5rem' }}>
                    {ticket.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      router.push(`/tickets/${ticket.id}`);
                    }}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Ver Detalles →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', top: '100px', left: '50px', width: '288px', height: '288px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '200px', right: '50px', width: '288px', height: '288px', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
      </div>
    </ProtectedRoute>
  );
}
