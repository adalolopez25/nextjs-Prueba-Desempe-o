import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Header from '@/components/layout/Header';

export default function NewTicket() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          createdBy: user?.id,
          priority
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard/client');
      } else {
        setError(data.error || 'Failed to create ticket');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Create New Ticket</h1>
              <p className="text-gray-600 mt-2">Submit a new support request</p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the issue"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description of the issue, steps to reproduce, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'low', label: 'Low', color: 'text-green-600' },
                      { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
                      { value: 'high', label: 'High', color: 'text-red-600' }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 cursor-pointer ${
                          priority === option.value ? 'font-medium' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={priority === option.value}
                          onChange={(e) => setPriority(e.target.value as any)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className={option.color}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/dashboard/client')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Ticket'}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="mt-6 text-sm text-gray-600">
              <p className="font-medium mb-1">Tips for better support:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be specific about the issue</li>
                <li>Include steps to reproduce if possible</li>
                <li>Mention any error messages you see</li>
                <li>Specify when the issue started</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}