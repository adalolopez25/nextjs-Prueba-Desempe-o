"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginPage: Form submitted', { email, password });
    
    setError('');
    setLoading(true);

    const success = await login(email, password);
    console.log('LoginPage: Login result', success);

    if (success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('LoginPage: User from localStorage', user);
      
      if (user.role === 'client') {
        console.log('LoginPage: Redirecting to client dashboard');
        router.push('/dashboard/client');
      } else {
        console.log('LoginPage: Redirecting to agent dashboard');
        router.push('/dashboard/agent');
      }
    } else {
      console.log('LoginPage: Login failed, showing error');
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  // Agrega un botón de prueba
  const testLogin = async (testEmail: string, testPassword: string) => {
    console.log('LoginPage: Test login with', { testEmail, testPassword });
    setEmail(testEmail);
    setPassword(testPassword);
    
    setError('');
    setLoading(true);
    
    const success = await login(testEmail, testPassword);
    console.log('LoginPage: Test login result', success);
    
    if (success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'client') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/agent');
      }
    } else {
      setError('Test login failed - check console for details');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">HelpDeskPro</h1>
        <p className="text-center text-gray-600 mb-8">Support Ticket System</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        {/* Botones de prueba */}
        <div className="mt-6 space-y-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full text-sm"
            onClick={() => testLogin('cliente@example.com', 'cliente123')}
          >
            Test Login as Client
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            className="w-full text-sm"
            onClick={() => testLogin('agente@example.com', 'agente123')}
          >
            Test Login as Agent
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-medium mb-2">Demo credentials:</p>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="mb-1">
              <span className="font-semibold">Client:</span> 
              <span className="ml-2">cliente@example.com / cliente123</span>
            </div>
            <div>
              <span className="font-semibold">Agent:</span> 
              <span className="ml-2">agente@example.com / agente123</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}