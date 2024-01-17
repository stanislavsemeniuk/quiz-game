import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

import { rewriteCategory, capitalizeString } from '@/helpers/strings';

export default function GameOver({
  score,
  category,
  difficulty,
}: {
  score: number;
  category: string;
  difficulty: string;
}) {
  return (
    <Box
      width={{ xs: '80%', sm: '40%' }}
      minHeight="40%"
      borderRadius="16px"
      padding="16px"
      sx={{ background: '#fff', boxShadow: '0px 16px 24px rgba(227, 237, 255, 0.5)' }}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Box>
        <Typography component="h1" fontSize="24px">
          Game over!
        </Typography>
        <Typography component="h2" fontSize="18px">
          Your score: {score}
        </Typography>
      </Box>

      <Box display="flex" width="100%" justifyContent="space-around" margin="32px 0">
        <Box>
          <Typography component="h2" fontSize="18px">
            Category:
          </Typography>
          <Typography component="h3" fontSize="16px">
            {rewriteCategory(category)}
          </Typography>
        </Box>
        <Box>
          <Typography component="h2" fontSize="18px">
            Difficulty:
          </Typography>
          <Typography component="h3" fontSize="16px">
            {capitalizeString(difficulty)}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" width="100%" gap="16px" justifyContent="space-around">
        <Link href="/game">
          <Button
            size="small"
            color="secondary"
            variant="contained"
            sx={{ textTransform: 'capitalize' }}>
            Start new game
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            size="small"
            color="secondary"
            variant="contained"
            sx={{ textTransform: 'capitalize' }}>
            Go to your profile
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
