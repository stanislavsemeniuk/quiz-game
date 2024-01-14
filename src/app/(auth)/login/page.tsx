'use client';
import { TextField, Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { signIn } from '@/firebase/auth';

export default function Login() {
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();
  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push('/profile');
  }, [user]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e: any) {
    e.preventDefault();
    const { result: userCredentials, error } = await signIn(email, password);
    if (error) {
      if (error || userCredentials) {
        enableNotification({ type: 'error', message: error as string });
      }
    }
    return userCredentials;
  }

  return (
    <Box onSubmit={handleLogin} component="form" display="contents">
      <Typography fontSize="24px" component="h1" textAlign="center">
        Login
      </Typography>
      <Box
        flexGrow="1"
        margin="24px 0"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="16px">
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          color="secondary"
          label="Email"
          type="email"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          color="secondary"
          label="Password"
          type="password"
        />
      </Box>
      <Button variant="contained" color="secondary" type="submit">
        Login
      </Button>
    </Box>
  );
}
