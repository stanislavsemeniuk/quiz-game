'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Box } from '@mui/material';

import firebase_app from '@/firebase/config';
import Loading from '@/components/Loading';

const auth = getAuth(firebase_app);
const AuthContext = createContext<{ user: User | null }>({ user: null });

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <Box
          position="fixed"
          left="0"
          top="0"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Loading />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext should be used within a AuthContextProvider');
  }
  return context;
}
