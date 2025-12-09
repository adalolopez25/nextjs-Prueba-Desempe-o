import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Ticket } from '@/types';
import Header from '@/components/layout/Header';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/tickets?userId=${user?.id}&role=${user?.role}`);
      const data = await response.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge type="info">Open</Badge>;
      case 'in_progress': return <Badge type="warning">In Progress</Badge>;
      case 'resolved': return <Badge type="success">Resolved</Badge>;
      case 'closed': return <Badge type="danger">Closed</Badge>;
      default: return <Badge type="info">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low': return <Badge type="info">Low</Badge>;
      case 'medium': return <Badge type="warning">Medium</Badge>;
      case 'high': return <Badge type="danger">High</Badge>;
      default: return <Badge type="info">{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={() => router.push('/tickets/new')}>
              New Ticket
            </Button>
          </div>

          {tickets.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't created any tickets yet.</p>
              <Button onClick={() => router.push('/tickets/new')}>
                Create Your First Ticket
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {ticket.title}
                    </h3>
                    {getStatusBadge(ticket.status)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Priority:</span>
                      <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}