// app/ticket/[id].tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Comment, Ticket, TicketStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ticketService, commentService } from '@/lib/services';

export default function TicketPage({ params }: { params: { id: string } }) {
  const ticketId = params?.id;
  const { user } = useAuth();
  const router = useRouter();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ticketId) return;
    fetchAll();
    // eslint-disable-next-line
  }, [ticketId]);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const t = await ticketService.getById(ticketId);
      if (t.status === 200 && t.data.success) setTicket(t.data.data);

      const c = await commentService.getByTicket(ticketId);
      if (c.status === 200 && c.data.success) setComments(c.data.data);
    } catch (err) {
      console.error('fetchAll error', err);
      setError('Error fetching ticket data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return setError('Comment cannot be empty');
    if (!user) return setError('User not authenticated');

    setSaving(true);
    setError('');
    try {
      const resp = await commentService.create(ticketId, user.id, commentText.trim());
      if (resp.status === 201 && resp.data.success) {
        setCommentText('');
        // reload comments
        const c = await commentService.getByTicket(ticketId);
        if (c.status === 200 && c.data.success) setComments(c.data.data);
      } else {
        setError(resp.data?.error || 'Failed to post comment');
      }
    } catch (err) {
      console.error('add comment error', err);
      setError('Failed to add comment');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeStatus = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    setError('');
    try {
      const resp = await ticketService.update(ticket.id, { status: newStatus });
      if (resp.status === 200 && resp.data.success) {
        setTicket(resp.data.data);
      } else {
        setError(resp.data?.error || 'Failed to update ticket');
      }
    } catch (err) {
      console.error('change status error', err);
      setError('Failed to update ticket');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Ticket not found.</p>
          <div className="mt-4">
            <Button onClick={() => router.back()}>Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{ticket.title}</h2>
                  <p className="text-sm text-gray-500">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div>{getStatusBadge(ticket.status)}</div>
              </div>
              <p className="text-gray-700 mb-6">{ticket.description}</p>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Comments</h3>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="p-3 bg-white rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm font-medium text-gray-800">
                            {c.author}
                          </div>
                          <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-sm text-gray-700">{c.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add comment</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                  rows={4}
                />
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                <div className="mt-3 flex gap-2">
                  <Button onClick={handleAddComment} disabled={saving}>
                    {saving ? 'Posting...' : 'Post Comment'}
                  </Button>
                  <Button variant="secondary" onClick={() => setCommentText('')}>Clear</Button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-800">Ticket Info</h4>
                <div className="text-sm text-gray-600 mt-2">
                  <div><strong>Priority:</strong> {ticket.priority}</div>
                  <div><strong>Assigned to:</strong> {ticket.assignedTo || 'Unassigned'}</div>
                  <div><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              {user?.role === 'agent' && (
                <>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Agent Actions</h4>
                  <div className="flex flex-col gap-2">
                    {ticket.status !== 'in_progress' && (
                      <Button size="sm" onClick={() => handleChangeStatus('in_progress')}>Start Progress</Button>
                    )}
                    {ticket.status === 'in_progress' && (
                      <Button size="sm" variant="primary" onClick={() => handleChangeStatus('resolved')}>Mark Resolved</Button>
                    )}
                    {ticket.status === 'resolved' && (
                      <Button size="sm" variant="danger" onClick={() => handleChangeStatus('closed')}>Close Ticket</Button>
                    )}
                  </div>
                </>
              )}

              {user?.role === 'client' && (
                <div className="mt-4">
                  <Button size="sm" variant="secondary" onClick={() => router.push('/dashboard/client')}>Back to My Tickets</Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
