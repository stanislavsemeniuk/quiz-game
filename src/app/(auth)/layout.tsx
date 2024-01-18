import { Box } from '@mui/material';

export const metadata = {
  title: 'Auth page | Quiz Game',
  description:
    'To start playing and enjoying the game, register your account now and dive into the world of quizzes!',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box flexGrow="1" display="flex" alignItems="center" justifyContent="center">
      <Box
        width={{ xs: '80%', sm: '40%' }}
        minHeight="40%"
        borderRadius="16px"
        padding="16px"
        sx={{ background: '#fff', boxShadow: '0px 16px 24px rgba(227, 237, 255, 0.5)' }}
        display="flex"
        flexDirection="column">
        {children}
      </Box>
    </Box>
  );
}
