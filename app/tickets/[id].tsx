import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Header from '@/components/layout/Header';
import { Ticket, Comment, User } from '@/types';

interface TicketDetailProps {
  ticket: Ticket;
  comments: Comment[];
  author: User;
  assignedTo?: User;
}

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (id) {
      fetchTicketData();
    }
  }, [id]);

  const fetchTicketData = async () => {
    try {
      const [ticketRes, commentsRes] = await Promise.all([
        fetch(`/api/tickets/${id}`),
        fetch(`/api/comments?ticketId=${id}`)
      ]);

      const ticketData = await ticketRes.json();
      const commentsData = await commentsRes.json();

      if (ticketData.success) {
        setTicket(ticketData.data);
      }

      if (commentsData.success) {
        setComments(commentsData.data);
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: id,
          author: user.id,
          message: newComment
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewComment('');
        fetchTicketData();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
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

  const handleStatusChange = async (newStatus: string) => {
    if (!user || user.role !== 'agent') return;

    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTicketData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Ticket not found</div>
      </div>
    );
  }

  const isClient = user?.role === 'client';
  const isAgent = user?.role === 'agent';

  return (
    <ProtectedRoute allowedRoles={['client', 'agent']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <button
                onClick={() => user?.role === 'client' ? router.push('/dashboard/client') : router.push('/dashboard/agent')}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>

            {/* Ticket Header */}
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{ticket.title}</h1>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Ticket #{ticket.id}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                </div>
                
                {isAgent && (
                  <div className="flex space-x-2">
                    {ticket.status === 'open' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange('in_progress')}
                      >
                        Start Progress
                      </Button>
                    )}
                    
                    {ticket.status === 'in_progress' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatusChange('resolved')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    
                    {ticket.status === 'resolved' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatusChange('closed')}
                      >
                        Close Ticket
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-6">{ticket.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Created By</p>
                  <p className="font-medium">User ID: {ticket.createdBy}</p>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Comments ({comments.length})</h2>
              
              {comments.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-600">No comments yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-medium">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-800">
                              User ID: {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.message}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            {(ticket.status !== 'closed' && (isClient || isAgent)) && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Add a Comment</h3>
                <form onSubmit={handleAddComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    placeholder="Type your message here..."
                    required
                  />
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {ticket.status === 'closed' && (
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-600">This ticket is closed. No further comments can be added.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}