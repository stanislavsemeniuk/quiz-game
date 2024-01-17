import { Box } from '@mui/material';

export const metadata = {
  title: 'Play | Quiz Game',
  description: 'Test your skills and compete with others to reach the top of the leaderboard!',
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      flexGrow="1"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center">
      {children}
    </Box>
  );
}
