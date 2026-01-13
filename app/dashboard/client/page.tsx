"use client";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import { Ticket } from "@/types";
import { useRouter } from "next/navigation";

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
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- COMPONENTES DE ESTILO ---
  const Badge = ({ children, colorClass }: { children: React.ReactNode; colorClass: string }) => (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${colorClass}`}>
      {children}
    </span>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20">Open</Badge>;
      case "in_progress": return <Badge colorClass="bg-amber-500/10 text-amber-400 border-amber-500/20">In Progress</Badge>;
      case "resolved": return <Badge colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Resolved</Badge>;
      case "closed": return <Badge colorClass="bg-slate-500/10 text-slate-400 border-slate-500/20">Closed</Badge>;
      default: return <Badge colorClass="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge colorClass="bg-red-500/20 text-red-400 border-red-500/30 font-black">High</Badge>;
      case "medium": return <Badge colorClass="bg-orange-500/10 text-orange-400 border-orange-500/20">Medium</Badge>;
      default: return <Badge colorClass="bg-slate-800 text-slate-400 border-slate-700">Low</Badge>;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
        <Header />
        
        <div className="max-w-7xl mx-auto px-6 mt-10">
          {/* Welcome Section */}
          <div className="mb-10 p-8 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-white text-2xl font-black tracking-tight">Hello, {user?.name}</h3>
              <p className="text-slate-400 text-sm">Here is the current status of your support requests.</p>
            </div>
            
            <button
              onClick={() => router.push("/tickets/new")}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              + Create New Ticket
            </button>
          </div>

          {/* Tickets Grid (No clickable items) */}
          {tickets.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
              <p className="text-slate-500 italic">No tickets found in your history.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-2 mb-4">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-2">
                      {ticket.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                      {ticket.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Created on</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}