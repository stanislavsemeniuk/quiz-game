'use client';

import { Box, Typography, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { signUp } from '@/firebase/auth';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  async function handleRegister(data: FormValues) {
    const { result, error } = await signUp(data.email, data.password);
    reset();
    if (error || result) {
      enableNotification({ type: 'error', message: error || 'Error occured' });
    }
  }
  return (
    <Box onSubmit={handleSubmit(handleRegister)} component="form" display="contents">
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
        <Box display="flex" flexDirection="column" gap="4px">
          <TextField
            {...register('email', { required: 'Email is required' })}
            color="secondary"
            label="Email"
            type="email"
          />
          {errors.email && (
            <Typography fontSize="12px" color="red">
              {errors.email.message}
            </Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <TextField
            {...register('password', {
              required: 'Password is requred',
              minLength: { value: 6, message: 'Password should be at least 6 characters' },
            })}
            color="secondary"
            label="Password"
            type="password"
          />
          {errors.password && (
            <Typography fontSize="12px" color="red">
              {errors.password.message}
            </Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <TextField
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) => getValues('password') === value || 'Passwords must match',
            })}
            color="secondary"
            label="Confirm password"
            type="password"
          />
          {errors.confirmPassword && (
            <Typography fontSize="12px" color="red">
              {errors.confirmPassword.message}
            </Typography>
          )}
        </Box>
      </Box>
      <Button disabled={isSubmitting} variant="contained" color="secondary" type="submit">
        Register
      </Button>
    </Box>
  );
}
