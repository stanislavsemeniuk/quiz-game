'use client';

import { Box, Button, Typography } from '@mui/material';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Link from 'next/link';

import { useAuthContext } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuthContext();
  return (
    <Box
      display="flex"
      flexGrow="1"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignContent="center"
      padding="0 32px">
      <Box maxWidth="600px" margin="0 auto">
        {user ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap="24px">
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
              <Box display="flex" gap="8px" alignItems="center">
                <AccountBoxIcon />
                <Typography>Profile</Typography>
              </Box>
            </Link>
            <Link href="/leaderboards">
              <Box display="flex" gap="8px" alignItems="center">
                <LeaderboardIcon />
                <Typography>Leaderboards</Typography>
              </Box>
            </Link>
          </Box>
        ) : (
          <>
            <Typography textAlign={{ xs: 'justify', sm: 'left' }} component="h1" fontSize="36px">
              Welcome to the Quiz Game!
            </Typography>
            <Typography textAlign={{ xs: 'justify', sm: 'left' }} fontSize="18px" margin="16px 0">
              Challenge your knowledge in various categories and have fun while answering exciting
              questions. To start playing and enjoying the game, register your account now and dive
              into the world of quizzes! Test your skills and compete with others to reach the top
              of the leaderboard.
            </Typography>
            <Typography textAlign={{ xs: 'justify', sm: 'left' }} fontSize="18px" margin="16px 0">
              Get ready to embark on a thrilling journey of learning and entertainment. Sign up and
              let the games begin!
            </Typography>
            <Typography textAlign={{ xs: 'justify', sm: 'left' }} color='rgb(133, 122, 122)' fontStyle='italic' fontSize="16px" margin="16px 0">
              Created as dyploma project by <Link style={{color:'#3498db',textDecoration:'underline'}} target='_blank' href='https://stanislavsemeniuk.github.io/'>Stanislav Semeniuk</Link>
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
