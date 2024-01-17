'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { useForm } from 'react-hook-form';
import { Box, Typography, TextField, Button } from '@mui/material';

import { resetPassword } from '@/firebase/auth';

type FormInputs = {
  email: string;
};

export default function ForgotPassword() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { enableNotification } = useNotificationContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  async function handleResetPassword(data: FormInputs) {
    const { result, error } = await resetPassword(data.email);
    if (!error)
      enableNotification({
        type: 'success',
        message: 'Reset link succesfully sent to your email!',
      });
    else enableNotification({ type: 'error', message: error || 'Error' });
  }

  return (
    <Box onSubmit={handleSubmit(handleResetPassword)} component="form" display="contents">
      <Typography fontSize="24px" component="h1" textAlign="center">
        Reset your password
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
        <Button disabled={isSubmitting} variant="contained" color="secondary" type="submit">
          Register
        </Button>
      </Box>
    </Box>
  );
}
