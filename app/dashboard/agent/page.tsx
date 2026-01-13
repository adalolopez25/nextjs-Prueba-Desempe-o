"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Header from "@/components/layout/Header";
import { Ticket, TicketStatus } from "@/types";
import { useRouter } from "next/navigation";

export default function AgentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
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

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchTickets();
        if (status === "in_progress") {
          router.push(`/tickets/${ticketId}`);
        } else {
          setFilter(status); 
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- NUEVA FUNCIÓN: ELIMINAR TICKET ---
  const handleDelete = async (ticketId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this ticket?")) return;
    
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // Actualizamos el estado local para que desaparezca sin recargar
        setTickets(tickets.filter(t => t.id !== ticketId));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // --- STYLE COMPONENTS ---
  const Badge = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${colorClass}`}>
      {children}
    </span>
  );

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "open": return <Badge colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20">Open</Badge>;
      case "in_progress": return <Badge colorClass="bg-amber-500/10 text-amber-400 border-amber-500/20">In Progress</Badge>;
      case "resolved": return <Badge colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Resolved</Badge>;
      case "closed": return <Badge colorClass="bg-slate-500/10 text-slate-400 border-slate-500/20">Closed</Badge>;
      default: return <Badge colorClass="bg-slate-800 text-slate-400 border-slate-700">{status}</Badge>;
    }
  };

  const filteredTickets = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["agent"]}>
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
        <Header />
        
        <div className="max-w-7xl mx-auto px-6 mt-10">
          {/* 1. QUICK STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Open Tickets", count: tickets.filter(t => t.status === 'open').length, color: "text-blue-500" },
              { label: "In Progress", count: tickets.filter(t => t.status === 'in_progress').length, color: "text-amber-500" },
              { label: "Resolved", count: tickets.filter(t => t.status === 'resolved').length, color: "text-emerald-500" },
              { label: "Total Managed", count: tickets.length, color: "text-white" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.count}</p>
              </div>
            ))}
          </div>

          {/* 2. ACTIVE FILTERS */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {["all", "open", "in_progress", "resolved", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  filter === s ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 3. ACTIVE TICKETS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <div key={t.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(t.status)}
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">ID: {t.id.slice(-6)}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">{t.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">{t.description}</p>
                  
                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-800/50">
                    {/* BOTÓN ELIMINAR (TARJETA) */}
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-black px-4 py-2 rounded-lg transition-all"
                    >
                      DELETE
                    </button>

                    {t.status === "open" && (
                      <button onClick={() => handleStatusChange(t.id, "in_progress")} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black px-4 py-2 rounded-lg transition-all">ATTEND</button>
                    )}
                    {t.status === "in_progress" && (
                      <button onClick={() => handleStatusChange(t.id, "resolved")} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black px-4 py-2 rounded-lg transition-all">RESOLVE</button>
                    )}
                    <button onClick={() => router.push(`/tickets/${t.id}`)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-black px-4 py-2 rounded-lg transition-all">DETAILS</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
                <p className="text-slate-500 font-medium">No tickets found in this category.</p>
              </div>
            )}
          </div>

          {/* 4. MANAGEMENT HISTORY SECTION */}
          <div className="mt-10 pt-10 border-t border-slate-900">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Management History</h2>
                    <p className="text-slate-500 text-sm">Review recently resolved or closed cases.</p>
                </div>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ticket Subject</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length > 0 ? (
                    tickets.filter(t => t.status === 'resolved' || t.status === 'closed').map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-white text-sm font-bold group-hover:text-indigo-400 transition-colors">{t.title}</p>
                            <p className="text-[10px] text-slate-600 font-medium uppercase">{new Date(t.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-3 items-center">
                                {/* BOTÓN ELIMINAR (TABLA) */}
                                <button 
                                  onClick={() => handleDelete(t.id)}
                                  className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-colors"
                                >
                                  Delete
                                </button>
                                <button onClick={() => router.push(`/tickets/${t.id}`)} className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">View Report</button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-slate-600 text-xs uppercase tracking-widest italic">No history available yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}