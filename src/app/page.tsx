'use client';

import { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-government-dark to-government-medium">
        <div className="text-white text-xl">Loading EdoSecure AI...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  }} />;
}
