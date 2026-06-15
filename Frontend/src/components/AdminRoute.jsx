import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#760000]" />
            <p className="font-serif text-sm italic text-gray-500 animate-pulse">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
