'use client';

import { Box, Typography, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { signUp } from '@/firebase/auth';

export default function Register() {
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();
  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e: any) {
    e.preventDefault();
    const { result, error } = await signUp(email, password);
    if (error || result) {
      enableNotification({ type: 'error', message: error as string });
    }
  }
  return (
    <Box onSubmit={handleRegister} component="form" display="contents">
      <Typography fontSize="24px" component="h1" textAlign="center">
        Register
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
        Register
      </Button>
    </Box>
  );
}
