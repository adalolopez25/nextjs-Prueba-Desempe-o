// app/tickets/new/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { ticketService } from '@/lib/services';

export default function NewTicketPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('User not authenticated');
    if (!title.trim() || !description.trim()) return setError('Title and description are required');

    setLoading(true);
    setError('');
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.id,
        priority
      };
      const resp = await ticketService.create(payload);
      if (resp.status === 201 && resp.data.success) {
        router.push('/dashboard/client');
      } else {
        setError(resp.data?.error || 'Failed to create ticket');
      }
    } catch (err) {
      console.error('create ticket error', err);
      setError('Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-semibold mb-4">Create New Ticket</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="p-2 border rounded">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Ticket'}</Button>
              <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
