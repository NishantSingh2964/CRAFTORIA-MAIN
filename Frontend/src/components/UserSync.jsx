import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

const UserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      // Only sync if signed in and sync hasn't run in this session
      if (isLoaded && isSignedIn && user && !sessionStorage.getItem('userSynced')) {
        // Mark as synced immediately to prevent concurrent loops during the async fetch
        sessionStorage.setItem('userSynced', 'true');

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
          } else {
            console.warn('User sync returned non-ok status:', response.status);
          }
        } catch (err) {
          console.error('Error syncing user to database:', err);
        }
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user?.id]); // Only depend on identity

  return null;
};

export default UserSync;
