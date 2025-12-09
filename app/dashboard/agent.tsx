import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Ticket, TicketStatus } from '@/types';
import Header from '@/components/layout/Header';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
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

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filter);

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchTickets();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
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

  const statusOptions: { value: TicketStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Tickets' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No tickets found with the selected filter.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {ticket.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.location.href = `/tickets/${ticket.id}`}
                      >
                        View & Respond
                      </Button>
                      
                      {ticket.status === 'open' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                        >
                          Start Progress
                        </Button>
                      )}
                      
                      {ticket.status === 'in_progress' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(ticket.id, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      
                      {ticket.status === 'resolved' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(ticket.id, 'closed')}
                        >
                          Close Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}