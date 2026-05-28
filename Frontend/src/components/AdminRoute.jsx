import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [dbAdmin, setDbAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        toast.error('Identity required. Please login.');
        navigate('/', { replace: true });
        return;
      }

      // First check Clerk Metadata (fastest)
      if (user?.publicMetadata?.role === 'admin') {
        setDbAdmin(true);
        setLoading(false);
        return;
      }

      // Verification with MongoDB sync (ensures user exists and role is promoted)
      try {
        const token = await getToken();
        const response = await api.post('/users/sync', {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          avatar: user.imageUrl
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const userRole = response.data.data?.role;
        if (userRole === 'Admin' || userRole === 'SuperAdmin') {
          setDbAdmin(true);
        } else {
          toast.error('Access Denied: Administrative privileges required.');
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('Admin Auth Error:', err);
        toast.error('Verification failed. Returning to store.');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user, navigate, getToken]);

  if (loading || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#760000]" />
            <p className="font-serif text-sm italic text-gray-500 animate-pulse">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  return isSignedIn && dbAdmin ? children : null;
};

export default AdminRoute;
