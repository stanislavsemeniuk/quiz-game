'use client';

import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import { logOut } from '@/firebase/auth';
import { getUserData } from '@/firebase/db';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';

export default function Header() {
  const { enableNotification } = useNotificationContext();
  const { user } = useAuthContext();

  const [username, setUsername] = useState<string>('');

  async function handleLogOut(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const result = await logOut();
  }

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const { result: userData, error } = await getUserData(user?.uid);
        if (userData && !error) setUsername(userData.userName);
        else enableNotification({ type: 'error', message: error || 'error' });
      }
    }
    fetchUserData();
  }, [user, enableNotification]);

  return (
    <Box
      component="header"
      padding={{ xs: '16px', sm: '16px 48px' }}
      display="flex"
      justifyContent="space-between">
      {user ? (
        <>
          <Box display="flex" gap="16px" alignItems="center">
            <Link href="/">
              <HomeIcon color="secondary" sx={{ width: '32px', height: '32px' }} />
            </Link>
            <Link href="/game">
              <PlayArrowIcon color="secondary" sx={{ width: '32px', height: '32px' }} />
            </Link>
            <Link href="/leaderboards">
              <LeaderboardIcon color="secondary" sx={{ width: '32px', height: '32px' }} />
            </Link>
          </Box>
          <Box display="flex" gap="16px" alignItems="center">
            <Link href="/profile">
              <Box display="flex" gap="4px" alignItems="center">
                <AccountBoxIcon color="secondary" sx={{ width: '32px', height: '32px' }} />
                <Typography>{username ? username : '...'}</Typography>
              </Box>
            </Link>

            <Button onClick={handleLogOut}>
              <LogoutIcon
                color="secondary"
                sx={{ width: '32px', height: '32px', cursor: 'pointer' }}
              />
            </Button>
          </Box>
        </>
      ) : (
        <Box display="flex" gap="16px" width="100%" justifyContent="flex-end">
          <Link href="/login">
            <Button
              sx={{ textTransform: 'capitalize' }}
              variant="contained"
              size="small"
              color="secondary">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button
              sx={{ textTransform: 'capitalize' }}
              variant="contained"
              size="small"
              color="secondary">
              Register
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}
