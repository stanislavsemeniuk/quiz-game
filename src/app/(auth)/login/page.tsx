'use client';
import { TextField, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { signIn } from '@/firebase/auth';

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  async function handleLogin(data: FormValues) {
    const { result: userCredentials, error } = await signIn(data.email, data.password);
    reset();
    if (error || !userCredentials) {
      enableNotification({ type: 'error', message: error || 'Error occured' });
    }
  }

  return (
    <Box onSubmit={handleSubmit(handleLogin)} component="form" display="contents">
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
        <Box display="flex" flexDirection="column" gap="4px">
          <TextField
            {...register('email', { required: 'Email is required' })}
            color="secondary"
            label="Email"
            type="email"
          />
          {errors.email && (
            <Typography color="red" fontSize="12px">
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <TextField
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            color="secondary"
            label="Password"
            type="password"
          />
          {errors.password && (
            <Typography color="red" fontSize="12px">
              {errors.password.message}
            </Typography>
          )}
        </Box>
      </Box>
      <Button variant="contained" color="secondary" disabled={isSubmitting} type="submit">
        Login
      </Button>
      <Box margin="16px 0" display="flex" justifyContent="space-around">
        <Link href="/register">
          <Typography fontSize="12px">Don&apos;t have an account?</Typography>
        </Link>
        <Link href="/forgot-password">
          <Typography fontSize="12px">Forgot your password?</Typography>
        </Link>
      </Box>
    </Box>
  );
}
