"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import { Ticket, Comment, TicketStatus } from "@/types";
import '../ticket-detail.css';

export default function TicketDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`);
      const data = await res.json();
      if (data.success) setTicket(data.data as Ticket);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${id}`);
      const data = await res.json();
      if (data.success) setComments(data.data as Comment[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
      fetchComments();
      setLoading(false);
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, data.data as Comment]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    try {
      await fetch(`/api/tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTicket();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    const statusClasses: { [key in TicketStatus]: string } = {
      open: 'badge-open',
      in_progress: 'badge-in-progress',
      resolved: 'badge-resolved',
      closed: 'badge-closed'
    };
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {status === 'open' && '🔴 Abierto'}
        {status === 'in_progress' && '🟡 En Progreso'}
        {status === 'resolved' && '🟢 Resuelto'}
        {status === 'closed' && '⚫ Cerrado'}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses: { [key: string]: string } = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high'
    };
    return (
      <span className={`badge ${priorityClasses[priority] || 'badge-low'}`}>
        {priority === 'low' && '🟦 Baja'}
        {priority === 'medium' && '🟨 Media'}
        {priority === 'high' && '🟥 Alta'}
      </span>
    );
  };

  if (loading || !ticket) {
    return (
      <div className="ticket-detail-container">
        <Header />
        <div className="container">
          <div className="loading-message">
            <span className="loading-spinner">⏳</span>
            Cargando detalles del ticket...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail-container">
      <Header />
      
      <div className="container">
        <button 
          onClick={() => router.back()}
          className="back-btn"
        >
          ← Volver
        </button>

        {/* Ticket Details Card */}
        <div className="ticket-detail-card">
          <div className="ticket-header">
            <div className="ticket-title-section">
              <h1 className="ticket-title">{ticket.title}</h1>
              <div className="ticket-meta">
                <span className="ticket-meta-item">🆔 {ticket.id}</span>
                <span className="ticket-meta-item">👤 {ticket.userId}</span>
                <span className="ticket-meta-item">📅 {new Date(ticket.createdAt).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            <div className="ticket-badges">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>

          <p className="ticket-description">{ticket.description}</p>

          {/* Agent Actions */}
          {user?.role === "agent" && (
            <div className="ticket-actions">
              {ticket.status === "open" && (
                <button 
                  onClick={() => handleStatusChange("in_progress")}
                  className="action-btn action-btn-primary"
                >
                  🟡 Iniciar Progreso
                </button>
              )}
              {ticket.status === "in_progress" && (
                <button 
                  onClick={() => handleStatusChange("resolved")}
                  className="action-btn action-btn-success"
                >
                  ✅ Marcar Resuelto
                </button>
              )}
              {ticket.status === "resolved" && (
                <button 
                  onClick={() => handleStatusChange("closed")}
                  className="action-btn action-btn-danger"
                >
                  ⚫ Cerrar Ticket
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2 className="comments-title">💬 Comentarios</h2>

          {comments.length === 0 ? (
            <div className="ticket-detail-card" style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: '#cbd5e1', margin: 0 }}>No hay comentarios aún</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-item">
                <p className="comment-author">👤 {c.author}</p>
                <p className="comment-message">{c.message}</p>
                <p className="comment-date">
                  📅 {new Date(c.createdAt).toLocaleDateString('es-ES')} {new Date(c.createdAt).toLocaleTimeString('es-ES')}
                </p>
              </div>
            ))
          )}

          {/* Comment Input */}
          <div className="comment-input-group">
            <input
              type="text"
              placeholder="Escribe un comentario..."
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <button 
              onClick={handleAddComment}
              className="action-btn action-btn-primary"
            >
              📤 Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
