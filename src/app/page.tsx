'use client';

import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

import { useAuthContext } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuthContext();
  return (
    <Box
      display="flex"
      height="100%"
      flexGrow="1"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignContent="center">
      <Box maxWidth="600px" margin="0 auto">
        {user ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Link href="/game">
              <Button
                size="large"
                color="secondary"
                variant="contained"
                sx={{ textTransform: 'capitalize' }}>
                Start new game
              </Button>
            </Link>
            <Link href="/profile">
              <Typography marginTop="24px">Go to profile</Typography>
            </Link>
          </Box>
        ) : (
          <>
            <Typography component="h3">Welcome to our Quiz Game!</Typography>
            <Typography>
              Challenge your knowledge in various categories and have fun while answering exciting
              questions. To start playing and enjoying the game, register your account now and dive
              into the world of quizzes! Test your skills and compete with others to reach the top
              of the leaderboard.
            </Typography>
            <Typography>
              Get ready to embark on a thrilling journey of learning and entertainment. Sign up and
              let the games begin!
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
