import { Box } from '@mui/material';

export const metadata = {
  title: 'Profile | Quiz Game',
  description: 'Your profile. Change username, see best records and previous games',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box width="80%" margin="0 auto">
      {children}
    </Box>
  );
}
