import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'client': return 'Client';
      case 'agent': return 'Support Agent';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => user?.role === 'client' ? router.push('/dashboard/client') : router.push('/dashboard/agent')}
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HelpDeskPro</h1>
                <p className="text-xs text-gray-500">Support Ticket System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-4">
              {user?.role === 'client' && (
                <>
                  <button
                    onClick={() => router.push('/dashboard/client')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      router.pathname === '/dashboard/client'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    My Tickets
                  </button>
                  <button
                    onClick={() => router.push('/tickets/new')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      router.pathname === '/tickets/new'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    New Ticket
                  </button>
                </>
              )}
              
              {user?.role === 'agent' && (
                <>
                  <button
                    onClick={() => router.push('/dashboard/agent')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      router.pathname === '/dashboard/agent'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{getRoleDisplay(user.role)}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {user && (
          <nav className="md:hidden flex space-x-2 mt-4 overflow-x-auto">
            {user?.role === 'client' && (
              <>
                <button
                  onClick={() => router.push('/dashboard/client')}
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    router.pathname === '/dashboard/client'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Tickets
                </button>
                <button
                  onClick={() => router.push('/tickets/new')}
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    router.pathname === '/tickets/new'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  New Ticket
                </button>
              </>
            )}
            
            {user?.role === 'agent' && (
              <button
                onClick={() => router.push('/dashboard/agent')}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  router.pathname === '/dashboard/agent'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;