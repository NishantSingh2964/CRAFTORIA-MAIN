import { useUser, useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../services/api';
import { useEffect } from 'react';

const UserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    // Register the token getter with our API service so all requests are authenticated
    setTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    const syncUser = async () => {
      // Only sync if signed in and sync hasn't run in this session
      if (isLoaded && isSignedIn && user && !sessionStorage.getItem('userSynced')) {
        try {
          // Log token for Postman testing
          const token = await getToken();
          console.log('--- CLERK READY ---');

          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              avatar: user.imageUrl,
            }),
          });

          if (response.ok) {
            console.log('User synced to MongoDB successfully');
            // Only set once confirmed
            sessionStorage.setItem('userSynced', 'true');
          } else {
            console.warn('User sync returned non-ok status:', response.status);
            // Don't set true so it can retry
            sessionStorage.removeItem('userSynced');
          }
        } catch (err) {
          console.error('Error syncing user to database:', err);
          sessionStorage.removeItem('userSynced');
        }
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user?.id]); // Only depend on identity

  return null;
};

export default UserSync;
