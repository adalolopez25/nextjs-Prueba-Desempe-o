"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import { Ticket, Comment, User } from "@/types";

export default function TicketDetailPage() {
  const { user } = useAuth() as { user: User | null };
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.ticketid as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el nuevo comentario
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticketId || !user) return;
    loadData();
  }, [ticketId, user]);

  // Auto-scroll al final cuando hay nuevos comentarios
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      const text = await res.text();
      if (!text) throw new Error("Empty response from server");
      const data = JSON.parse(text);

      if (data.success) {
        setTicket(data.data);
        const resC = await fetch(`/api/comments/${ticketId}`);
        const dataC = await resC.json();
        if (dataC.success) setComments(dataC.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/comments/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newComment }), // Tu API espera 'message'
      });

      const data = await res.json();
      if (data.success) {
        setComments([...comments, data.data]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error sending comment:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 pb-32">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white mb-6 text-[10px] font-black uppercase tracking-widest">
          ← Back to Panel
        </button>

        {/* Información del Ticket */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl mb-10 backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-black text-white leading-tight">{ticket?.title}</h1>
              <p className="text-indigo-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Ticket ID: {ticket?.id.slice(-6)}</p>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
              {ticket?.status}
            </span>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 text-slate-400 leading-relaxed italic">
            "{ticket?.description}"
          </div>
        </div>

        {/* Listado de Comentarios */}
        <div className="space-y-6">
          <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
            Internal Conversation
          </h3>
          
          <div className="space-y-4">
            {comments.map((c) => (
              <div 
                key={c.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  c.userId === user?.id 
                    ? "bg-indigo-600/10 border-indigo-500/30 ml-12 shadow-sm" 
                    : "bg-slate-900 border-slate-800 mr-12"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                    {c.user?.name || "Support Team"}
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold uppercase">
                    {new Date(c.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{c.content}</p>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Input de Comentarios Fijo Abajo */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 p-4">
        <form 
          onSubmit={handleSendComment}
          className="max-w-4xl mx-auto flex gap-3 bg-slate-900 border border-slate-700 p-2 rounded-2xl shadow-2xl"
        >
          <input 
            type="text" 
            placeholder="Write your response as an agent..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 text-white"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isSending || !newComment.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}